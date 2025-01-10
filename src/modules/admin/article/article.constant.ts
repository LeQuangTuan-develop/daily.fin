export const NAVI = {
  ARTICLE: {
    STATUS_TYPE: {
      DRAFT: 0,
      PUBLISHED: 1,
      STOP_SALE: 2,
    },
    ARTICLE_TYPE: {
      FREE: 1,
      PAID: 2,
    },
    ARTICLE_OPTION: {
      NONE: 0,
      ARTICLE: 1,
      ARTICLE_OF_SERIES: 2,
      SINGLE_ARTICLE_AND_SERIES: 3,
    },
  },
  SERIES: {
    STATUS_TYPE: {
      DRAFT: 0,
      PUBLISHED: 1,
      STOP_SALE: 2,
    },
    SERIES_TYPE: {
      FREE: 1,
      PAID: 2,
    },
  },
  MASTER_TYPE: {
    NORMAL: 0,
    ARTICLE: 1,
    SERIES: 2,
  },
  MASTER_TYPE_HASHTAG: {
    NORMAL: 'normal',
    ARTICLE: 'article',
    SERIES: 'series',
  },
}

export const LIST_STATUS_TYPE_SUPPORT_CHANGE = {
  DRAFT: [NAVI.ARTICLE.STATUS_TYPE.DRAFT, NAVI.ARTICLE.STATUS_TYPE.PUBLISHED],
  PUBLISHED: [NAVI.ARTICLE.STATUS_TYPE.DRAFT,NAVI.ARTICLE.STATUS_TYPE.PUBLISHED,NAVI.ARTICLE.STATUS_TYPE.STOP_SALE],
  STOP_SALE: [NAVI.ARTICLE.STATUS_TYPE.PUBLISHED, NAVI.ARTICLE.STATUS_TYPE.STOP_SALE, NAVI.ARTICLE.STATUS_TYPE.DRAFT],
}

export const LIST_STATUS_ABLE_TO_DELETE = [NAVI.ARTICLE.STATUS_TYPE.DRAFT]

export const ARTICLE_FIELDS_SCREEN1 = ['title', 'content']

export const SKI_NAVI_COMMENT = {
  STATUS_TYPE: {
    DISPLAY: 1,
    EDITED: 2,
    DELETED: 3,
  },
}
export const SKI_NAVI = {
  MASTER_TYPE: {
    ARTICLE: 1,
    SERIES: 2,
  },
}

export const PREFIX_SLUG_SKI_NAVI_ID = 'na'

export const PRICE_NAVI_VALUE_SEARCH_MAP = {
  ja: [0, 500, 5000, 10000, 30000, 50000, 100000],
  vi: [0, 50000, 1000000, 5000000, 10000000, 50000000, 100000000],
  en: [0, 3, 100, 500, 1000, 5000, 10000],
  th: [0, 100, 500, 1000, 5000, 10000, 20000],
}

