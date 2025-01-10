import {ApiHeader, ApiTags} from '@nestjs/swagger'
import {Body, Get, Param, Post, Put, Query, UseGuards, UsePipes} from '@nestjs/common'
import { ArticleDtoUnion} from './articleDetail.dto'
import {ArticleDetailServiceCommon} from './articleDetail.service'
import {ArticleGuard} from './article.guard'
import {ArticleDetailValidatePipe} from './article.pipe'
import {GgjParseIntPipe, GgjValidationPipe} from '../../../app.pipe'
import {MetaData} from '../../../decorators/metaData.decorator'
import {Throttle} from '@nestjs/throttler'
import {
  IArticleDetail,
} from './article.interface'

@ApiTags('Mypage article detail')
@ApiHeader({
  name: 'au-payload',
  schema: {
    default: '{"userId": 182312}',
  },
})
export class ArticleDetailControllerCommon {
  protected language: string
  protected constructor(
    protected readonly articleDetailService: ArticleDetailServiceCommon,
  ) {
    this.language = process.env.WEBSITE_LANGUAGE || 'ja'
  }

  @Post('create')
  @UsePipes(new GgjValidationPipe())
  async createArticle(
    @MetaData() metaData: TMetaData,
  ):Promise<TBaseDto<{id: number}>>  {
    return {
      data: await this.articleDetailService.createArticle(metaData)
    }
  }

  @Throttle(60, 30)
  @Put(':id/edit')
  @UseGuards(ArticleGuard)
  @UsePipes(new ArticleDetailValidatePipe('edit'))
  async updateArticle(
    @Body() body: ArticleDtoUnion,
    @MetaData() metaData: TMetaData,
    @Param('id', new GgjParseIntPipe()) id: number,
  ): Promise<TBaseDto<object>> {
    const article = await this.articleDetailService.validateBusinessArticle(id,body)
    return {
      data: await this.articleDetailService.updateArticle(metaData,id, body,article),
    }
  }

  @Throttle(60, 30)
  @Get(':id/edit')
  @UseGuards(ArticleGuard)
  async getArticleDetail(
    @Param('id', new GgjParseIntPipe()) id: number,
    @Query('isOrigin') isOrigin: number,
  ): Promise<TBaseDto<IArticleDetail>> {
    return {
      data: await this.articleDetailService.getArticleDetail(id, isOrigin)
    }
  }
}
