import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional, IsString, Max,
  MaxLength, Min, Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'
import {NAVI} from "./article.constant"
const LANGUAGE = process.env.WEBSITE_LANGUAGE || 'ja'

export type ValueOf<T> = T[keyof T]

// TODO: confirm value for en, th, vi
const NATION_FIELD = {
  ja: {
    TITLE: {
      MAX: 60
    },
    CONTENT: {
      MAX: 100000
    },
    PAID_CONTENT: {
      MAX: 100000
    },
    PRICE: {
      MIN: 500,
      MAX: 2200000
    }
  },
  en: {
    TITLE: {
      MAX: 60
    },
    CONTENT: {
      MAX: 100000
    },
    PAID_CONTENT: {
      MAX: 100000
    },
    PRICE: {
      MIN: 3,
      MAX: 50000,
    }
  },
  zh: {
    TITLE: {
      MAX: 60
    },
    CONTENT: {
      MAX: 100000
    },
    PAID_CONTENT: {
      MAX: 100000
    },
    PRICE: {
      MIN: 3,
      MAX: 50000,
    }
  },
  es: {
    TITLE: {
      MAX: 60
    },
    CONTENT: {
      MAX: 100000
    },
    PAID_CONTENT: {
      MAX: 100000
    },
    PRICE: {
      MIN: 3,
      MAX: 50000,
    }
  },
  th: {
    TITLE: {
      MAX: 60
    },
    CONTENT: {
      MAX: 100000
    },
    PAID_CONTENT: {
      MAX: 100000
    },
    PRICE: {
      MIN: 100,
      MAX: 500000,
    }
  },
  vi: {
    TITLE: {
      MAX: 120
    },
    CONTENT: {
      MAX: 100000
    },
    PAID_CONTENT: {
      MAX: 100000
    },
    PRICE: {
      MIN: 20000,
      MAX: 100000000,
    }
  },
}

@ValidatorConstraint({ name: 'ValidateJSON', async: false })
export class ValidateJSONEditorJs implements ValidatorConstraintInterface {
  validate(text: string) {
    try {
      if (text.trim() == '' || !text) {
        return true
      }
      const content = JSON.parse(text)

      return Object.prototype.hasOwnProperty.call(content,'blocks') && Array.isArray(content.blocks)
    } catch (e) {
      return false
    }
  }
  defaultMessage() {
    return 'Invalid content'
  }
}

@ValidatorConstraint({ name: 'ValidateJSONPaidContent', async: false })
export class ValidateJSONPaidContentEditorJs implements ValidatorConstraintInterface {
  validate(text: string) {
    try {
      if (text.trim() == '' || !text) {
        return true
      }
      const content = JSON.parse(text)
      return  Array.isArray(content)
    } catch (e) {
      return false
    }
  }
  defaultMessage() {
    return 'Invalid content'
  }
}


export class BaseAutoSavingDto {
  @IsNotEmpty()
  @MaxLength(NATION_FIELD[LANGUAGE].TITLE.MAX)
  title: string

  @IsNotEmpty()
  @Validate(ValidateJSONEditorJs)
  @MaxLength(NATION_FIELD[LANGUAGE].CONTENT.MAX)
  content: string
}


export class AutoSavingJaDto extends BaseAutoSavingDto{
  @IsOptional()
  @Validate(ValidateJSONPaidContentEditorJs)
  @MaxLength(NATION_FIELD[LANGUAGE].PAID_CONTENT.MAX)
  paidContent: string
}

export class BaseArticleDto {
  @IsNotEmpty()
  @MaxLength(NATION_FIELD[LANGUAGE].TITLE.MAX)
  title: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug: string

  @IsNotEmpty()
  @Validate(ValidateJSONEditorJs)
  @MaxLength(NATION_FIELD[LANGUAGE].CONTENT.MAX)
  content: string

  @IsNotEmpty()
  @IsIn([NAVI.ARTICLE.STATUS_TYPE.DRAFT, NAVI.ARTICLE.STATUS_TYPE.PUBLISHED])
  statusType: number

  @IsNotEmpty()
  @IsNumber()
  @IsIn([NAVI.ARTICLE.ARTICLE_TYPE.FREE])
  articleType: number

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  serviceCategoryMiddleId: number

  @IsNotEmpty()
  @IsIn([0, 1])
  @IsNumber()
  permitComment: boolean

  @IsNotEmpty()
  @IsIn([0, 1])
  @IsNumber()
  isReservedStart: boolean

  @IsNotEmpty()
  @IsNumber()
  reserveStartAt: number

  @IsOptional()
  articleOption: number

  @IsOptional()
  seriesId: number
}

export class ArticleJaDto extends BaseArticleDto {
  @IsNotEmpty()
  @IsIn([NAVI.ARTICLE.STATUS_TYPE.DRAFT, NAVI.ARTICLE.STATUS_TYPE.PUBLISHED, NAVI.ARTICLE.STATUS_TYPE.STOP_SALE])
  statusType: number

  @IsOptional()
  @Validate(ValidateJSONPaidContentEditorJs)
  @MaxLength(NATION_FIELD[LANGUAGE].PAID_CONTENT.MAX)
  paidContent: string

  @IsNotEmpty()
  @IsNumber()
  @IsIn([NAVI.ARTICLE.ARTICLE_TYPE.FREE, NAVI.ARTICLE.ARTICLE_TYPE.PAID])
  articleType: number

  @IsOptional()
  @IsNumber()
  @Min(NATION_FIELD[LANGUAGE].PRICE.MIN)
  @Max(NATION_FIELD[LANGUAGE].PRICE.MAX)
  price: number

  @IsNotEmpty()
  @IsNumber()
  @IsIn([NAVI.ARTICLE.ARTICLE_OPTION.ARTICLE, NAVI.ARTICLE.ARTICLE_OPTION.ARTICLE_OF_SERIES, NAVI.ARTICLE.ARTICLE_OPTION.SINGLE_ARTICLE_AND_SERIES])
  articleOption: number

  @IsNotEmpty()
  @IsNumber()
  seriesId: number
}

export const ARTICLE_DTO_DICT = {
  autoSave: {
    ja: AutoSavingJaDto,
    vi: BaseAutoSavingDto,
  },
  edit: {
    ja: ArticleJaDto,
    vi: BaseArticleDto,
  }
}

export type AutoSaveDtoUnion = InstanceType<ValueOf<typeof ARTICLE_DTO_DICT['autoSave']>>
export type ArticleDtoUnion = InstanceType<ValueOf<typeof ARTICLE_DTO_DICT['edit']>>

export class ChangeStatusDto {
  @IsNotEmpty()
  @IsIn([NAVI.ARTICLE.STATUS_TYPE.DRAFT, NAVI.ARTICLE.STATUS_TYPE.PUBLISHED, NAVI.ARTICLE.STATUS_TYPE.STOP_SALE])
  statusType: number
}

export class QuickCreateDto {
  @IsNotEmpty()
  @MaxLength(NATION_FIELD[LANGUAGE].TITLE.MAX)
  title: string

  @IsNotEmpty()
  @Validate(ValidateJSONEditorJs)
  @MaxLength(NATION_FIELD[LANGUAGE].CONTENT.MAX)
  content: string
}
