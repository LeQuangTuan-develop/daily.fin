import { InjectConnection } from "@nestjs/typeorm"
import { Connection } from "typeorm"
import { Inject } from "@nestjs/common"
import { IArticleDetail } from "./article.interface"
import { LIST_STATUS_TYPE_SUPPORT_CHANGE, NAVI } from "./article.constant"
import { ArticleException } from "./article.exception"
import { ArticleDtoUnion, ArticleJaDto } from "./articleDetail.dto"
import { DatabaseModule } from "../../../database.module"
import { DATABASE } from "../../../app.constants"
import { BusinessException } from "../../../app.exception"
import { NaviArticles, NaviDraftArticles } from "../../../entities"
import { getTextRawEditorJs } from "../../../utils/shared"
import { NaviArticleService } from "../../../services/naviArticle.service"
import { LANGUAGES } from "../../../utils/contants"

export class ArticleDetailServiceCommon {
  @InjectConnection(DatabaseModule.getConnectionName(DATABASE.NAMES.SKIJAN))
  private skijanConnection: Connection
  @Inject()
  private readonly articleCommonService: NaviArticleService
  protected language: string

  protected constructor() {
    this.language = process.env.WEBSITE_LANGUAGE || "ja"
  }

  async getArticleDetail(id: number, isOrigin = 0): Promise<IArticleDetail> {
    const [article, isHasAvatar] = await Promise.all([
      this._getDetailArticle(id),
      this.articleCommonService.isHasAvatar(id),
    ])
    if (article.statusType === NAVI.ARTICLE.STATUS_TYPE.STOP_SALE) {
      throw new BusinessException(ArticleException.EAIStopSale, "EAIStopSale")
    }
    article.isHasAvatar = Number(isHasAvatar)
    article.avatarImage =
      "/img/v3/skijan/mypage/display/navi/article/" + id + "?noDefaultImg=0"
    /*
     * safe check append paid content for series free but article set paidLine
     * Reduce:
     * Case can miss, article published before series published
     * (series before publish have price=> can set paidLine for article but when series published, it's free)
     * */
    const articleOfFreeSeries =
      article.isFreeSeries &&
      (article.articleOption == NAVI.ARTICLE.ARTICLE_OPTION.ARTICLE_OF_SERIES ||
        (article.articleOption ===
          NAVI.ARTICLE.ARTICLE_OPTION.SINGLE_ARTICLE_AND_SERIES &&
          article.articleType === NAVI.ARTICLE.ARTICLE_TYPE.FREE))
    if (
      article.statusType == NAVI.ARTICLE.STATUS_TYPE.PUBLISHED &&
      isOrigin == 1
    ) {
      await this.skijanConnection.getRepository(NaviDraftArticles).update(
        { isValid: 1, masterId: id },
        {
          statusType: article.statusType,
          title: article.title,
          content: article.content,
          paidContent: article.paidContent,
        },
      )
      return {
        ...article,
        isReservedStart:
          article.statusType == NAVI.ARTICLE.STATUS_TYPE.PUBLISHED &&
          article.publishedAt &&
          article.publishedAt < Date.now()
            ? 0
            : article.isReservedStart,
        content: articleOfFreeSeries
          ? this.appendPaidLine(article?.content || "", article?.paidContent)
          : article.content || "",
        paidContent: articleOfFreeSeries ? "" : article?.paidContent,
      }
    }
    const draftArticle = await this._getDraftArticle(id)
    return {
      ...article,
      isCanChangeArticleOption: !article.publishedAt,
      isReservedStart:
        article.statusType == NAVI.ARTICLE.STATUS_TYPE.PUBLISHED &&
        article.publishedAt &&
        article.publishedAt < Date.now()
          ? 0
          : article.isReservedStart,
      title: draftArticle?.title || "",
      content: articleOfFreeSeries
        ? this.appendPaidLine(
            draftArticle?.content || "",
            draftArticle?.paidContent as string,
          )
        : draftArticle?.content || "",
      paidContent: articleOfFreeSeries ? "" : draftArticle?.paidContent || "",
    }
  }

  private appendPaidLine(content: string, paidContent?: string): string {
    if (!paidContent) {
      return content
    }
    // case paid content is empty
    if (paidContent === "[]") {
      return content
    }

    let dataPastedJson
    try {
      dataPastedJson = JSON.parse(content)
      // remove block paid line
      dataPastedJson.blocks.pop()
      content = JSON.stringify(dataPastedJson)
    } catch (e) {
      console.log("===Paste Json Error===", e)
    }

    // remove character [ at the top and ] at the end
    if (paidContent[0] === "[" && paidContent[paidContent.length - 1] === "]") {
      paidContent = paidContent.slice(1, paidContent.length - 1)
    }
    content = content || ""
    const position = content.lastIndexOf("}]")
    if (position !== -1) {
      content =
        content.slice(0, position + 1) +
        "," +
        paidContent +
        content.slice(position + 1)
    }
    return content
  }

  private async _getDetailArticle(id: number): Promise<IArticleDetail> {
    const runner = this.skijanConnection.createQueryRunner("slave")
    try {
      const sql = `
        SELECT articles.id                                        as id,
               articles.title                                     as title,
               articles.slug                                      as slug,
               articles.content                                 as content,
               articles.paid_content                                       AS paidContent,
               articles.status_type                                        AS statusType,
               articles.article_option                                     AS articleOption,
               articles.article_type                                       AS articleType,
               articles.service_category_middle_id                         AS serviceCategoryMiddleId,
               skjServiceCategoryMiddle.service_category_large_id AS serviceCategoryLargeId,
               articles.permit_comment                                     AS permitComment,
               articles.is_reserved_start                                  AS isReservedStart,
               articles.price + '' + 0                                     AS price,
               UNIX_TIMESTAMP(articles.reserve_start_at) * 1000 + '' + 0   AS reserveStartAt,
               UNIX_TIMESTAMP(articles.published_at) * 1000 + '' + 0       AS publishedAt,
               articles.series_id                                          AS seriesId,
               if(series.status_type = 1 and series.series_type = 1,1,0) + '' + 0 AS isFreeSeries
        FROM navi_articles as articles
               LEFT JOIN skijan.skj_service_category_middle as skjServiceCategoryMiddle
                         ON articles.service_category_middle_id = skjServiceCategoryMiddle.id
        left join navi_series as series
          on articles.series_id = series.id
          AND series.is_valid = 1
        WHERE articles.is_valid = 1
          AND articles.id = ?
      `
      const article = await runner.query(sql, [id])
      return article[0] as IArticleDetail
    } finally {
      await runner.release()
    }
  }

  public async _getDraftArticle(id: number): Promise<NaviDraftArticles | null> {
    return await this.skijanConnection
      .getRepository(NaviDraftArticles)
      .findOne({
        where: {
          isValid: 1,
          masterId: id,
        },
        select: ["statusType", "content", "paidContent", "title", "updatedAt"],
      })
  }

  async createArticle(metaData: TMetaData): Promise<{ id: number }> {
    const { userId, userAgent, ipAddress } = metaData
    const article = await this.skijanConnection
      .getRepository(NaviArticles)
      .insert({
        isValid: 1,
        statusType: 0,
        userId,
        countries: this.language,
        sourceLang: LANGUAGES.DETAIL_MAP[this.language].index,
        userAgent,
        ipAddress,
      })
    const id = article.identifiers[0].id
    if (!id) throw new BusinessException("EA001", ArticleException.EA001)
    await this.skijanConnection.getRepository(NaviDraftArticles).insert({
      isValid: 1,
      statusType: 0,
      userId,
      masterId: id,
      userAgent,
      ipAddress,
    })
    return {
      id,
    }
  }

  /**
   * +> article during public mode, article setting cannot be changed
   * (paid, free, category)
   * +> validate categoryId In table skj_service_category_middle
   *
   * */
  async validateBusinessArticle(
    id: number,
    body: ArticleDtoUnion,
  ): Promise<NaviArticles> {
    const runner = this.skijanConnection.createQueryRunner("slave")
    try {
      const article = await runner.manager.getRepository(NaviArticles).findOne({
        where: {
          isValid: 1,
          id,
        },
        select: ["statusType", "publishedAt", "articleOption", "userId"],
      })
      if (!article)
        throw new BusinessException("EA002", ArticleException.EA002)
      if (
        article.publishedAt &&
        article.publishedAt < new Date() &&
        body.articleOption !== article.articleOption
      ) {
        throw new BusinessException("EA002", ArticleException.EA002)
      }
      this.validateChangeStatusType(article, body)
      return article
    } finally {
      await runner.release()
    }
  }

  public validateChangeStatusType(
    article: NaviArticles,
    body: ArticleDtoUnion,
    isInputPage = true,
  ): void {
    if (article.statusType == NAVI.ARTICLE.STATUS_TYPE.PUBLISHED) {
      if (
        article.publishedAt &&
        new Date(article.publishedAt).getTime() < Date.now()
      ) {
        if (
          !LIST_STATUS_TYPE_SUPPORT_CHANGE.PUBLISHED.includes(
            body.statusType,
          ) &&
          body?.isReservedStart == true
        ) {
          throw new BusinessException(
            ArticleException.EA002,
            "CHANGE STATUS VALIDATE FAIL: PUBLISHED -> SCHEDULE",
          )
        }
      } else {
        if (
          !LIST_STATUS_TYPE_SUPPORT_CHANGE.PUBLISHED.includes(
            body.statusType,
          ) &&
          body.statusType == NAVI.ARTICLE.STATUS_TYPE.STOP_SALE
        ) {
          throw new BusinessException(
            ArticleException.EA002,
            "CHANGE STATUS VALIDATE FAIL: SCHEDULE -> STOP SALE",
          )
        }
      }
    }
    if (
      article.statusType == NAVI.ARTICLE.STATUS_TYPE.DRAFT &&
      !LIST_STATUS_TYPE_SUPPORT_CHANGE.DRAFT.includes(body.statusType)
    ) {
      throw new BusinessException(
        ArticleException.EA002,
        "CHANGE STATUS VALIDATE FAIL: DRAFT -> STOP_SALE",
      )
    }
    if (article.statusType == NAVI.ARTICLE.STATUS_TYPE.STOP_SALE) {
      if (isInputPage) {
        throw new BusinessException(
          ArticleException.EAIStopSale,
          "EAIStopSale",
        )
      } else {
        if (
          !LIST_STATUS_TYPE_SUPPORT_CHANGE.STOP_SALE.includes(body.statusType)
        ) {
          throw new BusinessException(
            ArticleException.EA002,
            "CHANGE STATUS VALIDATE FAIL: STOP_SALE -> DRAFT",
          )
        }
      }
    }
    if (
      body.articleType == NAVI.ARTICLE.ARTICLE_TYPE.FREE &&
      body.statusType == NAVI.ARTICLE.STATUS_TYPE.STOP_SALE
    ) {
      throw new BusinessException(
        ArticleException.EA002,
        "CHANGE STATUS VALIDATE FAIL: FREE -> STOP_SALE",
      )
    }
  }

  async updateArticle(
    metaData: TMetaData,
    id: number,
    body: ArticleDtoUnion,
    article: NaviArticles,
  ): Promise<object> {
    const statusType = body.statusType
    let publishedAt: Date | null = article.publishedAt
    const stopSaleAt: Date | null =
      body.statusType == NAVI.ARTICLE.STATUS_TYPE.STOP_SALE
        ? new Date()
        : article.stopSaleAt
    if (statusType == NAVI.ARTICLE.STATUS_TYPE.PUBLISHED) {
      publishedAt =
        body.isReservedStart && body.reserveStartAt > Date.now()
          ? new Date(body.reserveStartAt)
          : article.publishedAt == null ||
            new Date(article.publishedAt).getTime() > Date.now()
          ? new Date()
          : article.publishedAt
    }

    const textRawContent = getTextRawEditorJs(body.content)
    const isReservedStart = body.isReservedStart
    await Promise.all([
      /*
       * Use save in this case to save history data by subscriber
       */
      this.skijanConnection.getRepository(NaviArticles).save({
        id,
        articleOption:
          body.articleOption || NAVI.ARTICLE.ARTICLE_OPTION.ARTICLE,
        seriesId: body.seriesId || 0,
        articleType: body.articleType || 1,
        content: body.content,
        paidContent: (body as ArticleJaDto).paidContent || "",
        title: body.title,
        slug:
          metaData.userId === 110001 && this.language === LANGUAGES.TAG_MAP.VI
            ? body.slug || null
            : null,
        contentRaw: textRawContent,
        statusType,
        serviceCategoryMiddleId: body.serviceCategoryMiddleId,
        price:
          body.articleOption == NAVI.ARTICLE.ARTICLE_OPTION.ARTICLE_OF_SERIES
            ? 0
            : (body as ArticleJaDto)?.price || 0,
        publishedAt,
        stopSaleAt,
        permitComment: body.permitComment,
        isReservedStart,
        reserveStartAt: isReservedStart ? new Date(body.reserveStartAt) : null,
        ipAddress: metaData.ipAddress,
        userAgent: metaData.userAgent,
      }),
      this.skijanConnection.getRepository(NaviDraftArticles).update(
        { isValid: 1, masterId: id },
        {
          statusType: statusType,
          title: body.title,
          content: body.content,
          paidContent: (body as ArticleJaDto).paidContent,
        },
      ),
    ])

    return {}
  }

  async validateArticle(userId: number, articleId: number): Promise<boolean> {
    const runner = this.skijanConnection.createQueryRunner("slave")
    try {
      const article = await runner.manager.getRepository(NaviArticles).findOne({
        where: {
          isValid: 1,
          id: articleId,
          userId,
        },
      })
      return !!article
    } finally {
      await runner.release()
    }
  }
}
