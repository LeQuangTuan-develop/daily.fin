import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Farm", { schema: "dbo" })
export class Farm {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("smallint", { name: "isValid", default: () => "(1)" })
  isValid: boolean;

  @Column("nvarchar", { name: "Name", nullable: true, length: 100 })
  name: string | null;

  @Column("datetime2", { name: "CreatedAt", default: () => "getdate()" })
  createdAt: Date;

  @Column("datetime2", { name: "UpdatedAt" })
  updatedAt: Date;

  @Column("datetime2", { name: "UpdatedAt2" })
  updatedAt2: Date;
}
