import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('navi_comment_reactions', { schema: 'skijan' })
export class NaviCommentReactions {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: 'reaction comment navi ID',
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
    comment: '1: like',
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

  @Column('int', {
    name: 'master_id',
    comment: 'article ID or series ID',
    default: () => '\'0\'',
  })
    masterId: number

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
