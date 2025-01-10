import {Injectable} from '@nestjs/common'
import {InjectConnection} from '@nestjs/typeorm'
import {Connection} from 'typeorm'
import {DatabaseModule} from "../database.module"
import {DATABASE} from "../app.constants"
import {NaviArticles} from "../entities"

@Injectable()
export class NaviArticleService {
  protected readonly websiteLanguage: string
  @InjectConnection(DatabaseModule.getConnectionName(DATABASE.NAMES.SKIJAN))
  protected skjConnection: Connection
  constructor() {
    this.websiteLanguage = process.env.WEBSITE_LANGUAGE || 'ja'
  }

  public async isHasAvatar(id: number): Promise<boolean> {
    const sql = `
      SELECT id
      FROM common.images as images
      WHERE images.is_valid = 1
        AND images.master_id = ?
        AND images.status_type != 2 /* 2: admin verify */
        AND images.image_category_id = 49
    `
    const result = await this.skjConnection.query(sql, [id])
    return result.length > 0
  }

  async validateArticle(userId: number, articleId: number): Promise<boolean> {
    const runner = this.skjConnection.createQueryRunner("slave")
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
