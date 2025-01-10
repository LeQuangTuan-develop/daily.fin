import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('navi_articles', { schema: 'skijan' })
export class NaviArticles {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: 'article ID' })
    id: number

  @Column('tinyint', {
    name: 'is_valid',
    comment: 'Data valid flag\n 0: Invalid, 1: Valid',
    width: 1,
    default: () => '\'0\'',
  })
    isValid: number

  @Column('tinyint', {
    name: 'status_type',
    comment: '0: draft, 1: public',
    width: 1,
    default: () => '\'0\'',
  })
    statusType: number

  @Column('tinyint', {
    name: 'is_owner_withdrawal',
    comment: '0: owner not withdrawal, 1: owner withdrawal',
    width: 1,
    default: () => '\'0\'',
  })
    isOwnerWithdrawal: number

  @Column('tinyint', {
    name: 'article_type',
    comment: '1: free, 2: paid',
    width: 1,
    default: () => '\'1\'',
  })
    articleType: number

  @Column('tinyint', {
    name: 'article_option',
    comment: '1: single article, 2: article of series',
    width: 1,
    default: () => '\'1\'',
  })
    articleOption: number

  @Column('int', {
    name: 'user_id',
    comment: 'member ID',
    default: () => '\'0\'',
  })
    userId: number

  @Column('int', {
    name: 'series_id',
    comment: 'series ID',
    default: () => '\'0\'',
  })
    seriesId: number

  @Column('varchar', {
    name: 'title',
    nullable: true,
    comment: 'タイトル',
    length: 255,
  })
    title: string | null

  @Column('varchar', {
    name: 'slug',
    nullable: true,
    comment: 'Slug is custom from admin VN, only use for SEO apply for skijan-vi',
    length: 255,
  })
    slug: string | null

  @Column('longtext', {
    name: 'content',
    nullable: true,
    comment: '内容デフォルト表示',
  })
    content: string | null

  @Column('longtext', {
    name: 'content_raw',
    nullable: true,
    comment: '内容デフォルト表示',
  })
    contentRaw: string | null

  @Column('longtext', {
    name: 'paid_content',
    nullable: true,
    comment: '有料コンテンツ購入者のみ表示',
  })
    paidContent: string | null

  @Column('int', {
    name: 'service_category_middle_id',
    comment: 'service category middle',
    default: () => '\'0\'',
  })
    serviceCategoryMiddleId: number

  @Column('int', { name: 'price', nullable: true, comment: '出品価格' })
    price: number | null

  @Column('tinyint', {
    name: 'is_special_discount',
    nullable: true,
    comment: '特別値下げフラグ\n 0:通常、1:特別値下げ',
    width: 1,
    default: () => '\'0\'',
  })
    isSpecialDiscount: boolean | null

  @Column('int', {
    name: 'special_discount_price',
    nullable: true,
    comment: '値下げ価格',
  })
    specialDiscountPrice: number | null

  @Column('int', {
    name: 'special_discount_count',
    nullable: true,
    comment: '値下げ販売数',
  })
    specialDiscountCount: number | null

  @Column('timestamp', {
    name: 'special_discount_start_at',
    nullable: true,
    comment: '値下げ開始日',
  })
    specialDiscountStartAt: Date | null

  @Column('timestamp', {
    name: 'special_discount_end_at',
    nullable: true,
    comment: '値下げ終了日',
  })
    specialDiscountEndAt: Date | null

  @Column('tinyint', {
    name: 'is_reserved_start',
    comment: '公開日時予約フラグ\n0:予約なし、1:予約あり',
    width: 1,
    default: () => '\'0\'',
  })
    isReservedStart: boolean

  @Column('timestamp', {
    name: 'reserve_start_at',
    nullable: true,
    comment: '予約公開日時',
  })
    reserveStartAt: Date | null

  @Column('tinyint', {
    name: 'permit_comment',
    comment: 'Permit comment 0: Not allow comment, 1: Allow',
    width: 1,
    default: () => '\'1\'',
  })
    permitComment: boolean

  @Column('timestamp', {
    name: 'published_at',
    nullable: true,
    comment: '公開日時',
  })
    publishedAt: Date | null

  @Column('timestamp', {
    name: 'stop_sale_at',
    nullable: true,
    comment: '公開日時',
  })
    stopSaleAt: Date | null

  @Column('int', {
    name: 'source_lang',
    comment: 'term language seller',
    default: () => '\'1\'',
  })
    sourceLang: number

  @Column('varchar', {
    name: 'countries',
    nullable: false,
    comment: '国コード',
    length: 32,
  })
    countries: string


  @Column('varchar', {
    name: 'ip_address',
    nullable: true,
    comment: 'IPアドレス',
    length: 64,
  })
    ipAddress: string | null

  @Column('text', {
    name: 'user_agent',
    nullable: true,
    comment: 'ユーザーエージェント',
  })
    userAgent: string | null

  @Column('timestamp', {
    name: 'created_at',
    comment: 'Create date',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date

  @Column('timestamp', {
    name: 'updated_at',
    comment: 'Update date',
    default: () => 'CURRENT_TIMESTAMP',
  })
    updatedAt: Date
}
