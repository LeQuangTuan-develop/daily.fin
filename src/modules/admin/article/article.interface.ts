export interface IArticleDetail {
  id: number
  title: string
  slug?: string
  content?: string | null
  paidContent: string
  statusType: number
  articleOption: number
  articleType: number
  serviceCategoryMiddleId: number
  isCanChangeArticleOption: boolean
  serviceCategoryLargeId: number
  permitComment: number
  isReservedStart: number
  publishedAt: number
  reserveStartAt?: number | null
  isHasAvatar?: number
  isFreeSeries?: number
  avatarImage?: string
  hasSales: boolean
}

export interface IArticleVersion {
  versions: number
  data:
    | object
    | {
        origin: number
        draft: number
      }
}

export interface IArticleIndex {
  id: number
  title: string
  contentRaw: string
  articleType: number
  articleOption: number
  isSetPaidContent: number // 0: false, 1: true
  seriesPrice: number
  avatarUrl: string
  detailUrl: string
  date: number
  price: number
}

export interface IArticleItem {
  id: number
  title: string
  price: number
  statusType: number
  articleType: number
}

export interface IArticleType {
  data: IArticleItem[]
  pagingMeta: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    limit: number
    page: number
    totalItem: number
    totalPage: number
  }
}

export interface IAvailableArticleList {
  freeArticles: IArticleType
  paidArticles: IArticleType
}
