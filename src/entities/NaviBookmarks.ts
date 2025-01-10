import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('navi_bookmarks', { schema: 'skijan' })
export class NaviBookmarks {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: 'Bookmarks article ID',
  })
    id: number

  @Column('tinyint', {
    name: 'is_valid',
    comment: 'Data valid flag\n 0: Invalid, 1: Valid',
    width: 1,
    default: () => '\'0\'',
  })
    isValid: boolean

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
    name: 'master_id',
    comment: 'article ID or series ID',
    default: () => '\'0\'',
  })
    masterId: number

  @Column('timestamp', {
    name: 'created_at',
    comment: 'Created date',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date

  @Column('timestamp', {
    name: 'updated_at',
    comment: 'Updated date',
    default: () => 'CURRENT_TIMESTAMP',
  })
    updatedAt: Date
}
