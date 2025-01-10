import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('navi_comments', { schema: 'skijan' })
export class NaviComments {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: 'comment article ID',
  })
    id: number

  @Column('tinyint', {
    name: 'is_valid',
    comment: 'Data valid flag\n 0: Invalid, 1: Valid',
    width: 1,
    default: () => '\'0\'',
  })
    isValid: boolean

  @Column('tinyint', {
    name: 'status_type',
    comment: '0: hide, 1: display',
    width: 1,
    default: () => '\'1\'',
  })
    statusType: number

  @Column('int', {
    name: 'user_id',
    comment: 'member ID',
    default: () => '\'0\'',
  })
    userId: number

  @Column('tinyint', {
    name: 'master_type',
    comment: '0: none, 1: article, 2: series',
    width: 1,
    default: () => '\'0\'',
  })
    masterType: number

  @Column('int', {
    name: 'parent_comment_id',
    comment: '0 : comment , navi_comment.id : reply comment',
    default: () => '\'0\'',
  })
    parentCommentId: number

  @Column('varchar', { name: 'content', nullable: true, length: 255 })
    content: string | null

  @Column('int', {
    name: 'master_id',
    comment: 'article ID or series ID',
    default: () => '\'0\'',
  })
    masterId: number

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
    name: 'deleted_at',
    comment: 'Deleted date',
  })
    deletedAt: Date

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
