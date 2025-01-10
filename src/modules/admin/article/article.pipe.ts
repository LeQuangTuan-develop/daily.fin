import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { isArray, validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import {ArticleException} from './article.exception'
import {ARTICLE_DTO_DICT} from './articleDetail.dto'
import {AppError, BusinessException} from "../../../app.exception"
import {NAVI} from "./article.constant"

@Injectable()
export class ArticleDetailValidatePipe implements PipeTransform {
  private readonly language: string
  private type: string
  constructor(type: string) {
    this.language = process.env.WEBSITE_LANGUAGE || 'ja'
    if(!['autoSave', 'edit'].includes(type)) {
      throw new BusinessException(AppError.ECI500,'Type incorrect')
    }
    this.type = type
  }
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (metadata.type !== 'body') {
      return value
    }
    if (this.isEmpty(value)) {
      throw new BadRequestException(ArticleException.EA002,'Validate failed')
    }
    /*
   * TODO VUTU
   * Open when support all for global
   *
   const { metatype } = metadata
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }*/
    const metatype = ARTICLE_DTO_DICT[this.type][this.language]
    const object = plainToInstance(metatype, value)
    const errors = await validate(object)
    if (value.statusType == NAVI.ARTICLE.STATUS_TYPE.DRAFT) {
      const flag = errors.every((error) => {
        return !error.value && error.property != 'title'
      })
      if (flag) {
        return value
      }
    }

    if(
      (value.articleOption === NAVI.ARTICLE.ARTICLE_OPTION.ARTICLE && value.seriesId)
      || (value.articleOption && (value.articleOption !== NAVI.ARTICLE.ARTICLE_OPTION.ARTICLE && !value.seriesId))
    ) {
      throw new BadRequestException(ArticleException.EA002,'Validate failed')
    }

    if (value.isReservedStart == 0) {
      const flag = errors.every((error) => {
        return error.property == 'reserveStartAt'
      })
      if (flag) {
        return value
      }
    }

    if (errors.length) {
      throw new BadRequestException(ArticleException.EA002,'Validate failed')
    }
    return value
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object]
    return !types.find((type) => metatype === type)
  }

  private isEmpty(value: any) {
    return (
      Object.keys(value).length < 1 ||
      typeof value != 'object' ||
      isArray(value)
    )
  }
}
