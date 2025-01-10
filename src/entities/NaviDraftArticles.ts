import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity("navi_draft_articles", { schema: "skijan" })
export class NaviDraftArticles {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id",
    comment: "article draft ID",
  })
  id: number

  @Column("tinyint", {
    name: "is_valid",
    comment: "Data valid flag\n 0: Invalid, 1: Valid",
    width: 1,
    default: () => "'0'",
  })
  isValid: number

  @Column("tinyint", {
    name: "status_type",
    comment: "0: hide, 1: display",
    width: 1,
    default: () => "'0'",
  })
  statusType: number

  @Column("int", {
    name: "master_id",
    comment: "master article ID",
    default: () => "'0'",
  })
  masterId: number

  @Column("int", {
    name: "user_id",
    comment: "member ID",
    default: () => "'0'",
  })
  userId: number

  @Column("varchar", {
    name: "title",
    nullable: true,
    comment: "タイトル",
    length: 255,
  })
  title: string | null

  @Column("longtext", {
    name: "content",
    nullable: true,
    comment: "内容デフォルト表示",
  })
  content: string | null

  @Column("longtext", {
    name: "content_raw",
    nullable: true,
    comment: "内容デフォルト表示",
  })
  contentRaw: string | null

  @Column("longtext", {
    name: "paid_content",
    nullable: true,
    comment: "有料コンテンツ購入者のみ表示",
  })
  paidContent: string | null

  @Column("varchar", {
    name: "ip_address",
    nullable: true,
    comment: "IPアドレス",
    length: 64,
  })
  ipAddress: string | null

  @Column("text", {
    name: "user_agent",
    nullable: true,
    comment: "ユーザーエージェント",
  })
  userAgent: string | null

  @Column("timestamp", {
    name: "created_at",
    comment: "Create date",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date

  @Column("timestamp", {
    name: "updated_at",
    comment: "Update date",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date
}
