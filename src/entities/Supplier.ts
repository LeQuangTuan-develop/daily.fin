import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('Supplier')
export class Supplier {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id',
        comment: 'Supplier ID'
    })
    id: number

    @Column('smallint', {
        name: 'isValid',
        comment: '0:not valid、1:valid',
        width: 1,
        default: () => "'0'",
    })
    isValid: boolean

    @Column('varchar', {
        name: 'supplierCode',
        nullable: true,
        comment: 'Supplier Code',
        length: 8,
    })
    supplierCode: string | null

    @Column('nvarchar', {
        name: 'name',
        nullable: true,
        comment: 'Supplier Name',
        length: 255,
    })
    name: string | null

    @Column('nvarchar', {
        name: 'address',
        nullable: true,
        comment: 'Address',
        length: 100,
    })
    address: string | null

    @Column('varchar', {
        name: 'phoneNumber',
        nullable: true,
        comment: 'Phone number',
        length: 11,
    })
    phoneNumber: string | null

    @Column('nvarchar', {
        name: 'profile',
        nullable: true,
        comment: 'Profile',
        length: 255,
    })
    profile: string | null

    @Column('varchar', {
        name: 'testResult',
        nullable: true,
        comment: 'Test result',
        length: 10,
    })
    testResult: string | null

    @Column('datetime2', {
        name: 'createdAt',
        comment: 'Created at',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date

    @Column('datetime2', {
        name: 'updatedAt',
        comment: 'Updated at',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date
}
