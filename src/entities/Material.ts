import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Material", { schema: "dbo" })
export class Material {
  @PrimaryGeneratedColumn({ type: "int", name: "ID" })
  id: number;

  @Column("varchar", { name: "materialCode", nullable: true, length: 10 })
  materialCode: string | null;

  @Column("nvarchar", { name: "name", nullable: true, length: 100 })
  name: string | null;

  @Column("nvarchar", { name: "group", nullable: true, length: 50 })
  group: string | null;

  @Column("smallint", { name: "isValid", default: () => "(1)" })
  isValid: boolean;

  @Column("datetime2", { name: "createdAt", default: () => "getdate()" })
  createdAt: Date;

  @Column("datetime2", { name: "updatedAt" })
  updatedAt: Date;

  @Column("datetime2", { name: "UpdatedAt2" })
  updatedAt2: Date;
}
