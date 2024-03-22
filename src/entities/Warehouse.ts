import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Warehouse", { schema: "dbo" })
export class Warehouse {
  @PrimaryGeneratedColumn({ type: "int", name: "ID" })
  id: number;

  @Column("smallint", { name: "isValid", default: () => "(1)" })
  isValid: boolean;

  @Column("int", { name: "FarmID", nullable: true })
  farmId: number | null;

  @Column("nvarchar", { name: "Name", nullable: true, length: 255 })
  name: string | null;

  @Column("datetime2", { name: "CreatedAt", default: () => "getdate()" })
  createdAt: Date;

  @Column("datetime2", { name: "UpdatedAt" })
  updatedAt: Date;

  @Column("datetime2", { name: "UpdatedAt2" })
  updatedAt2: Date;
}
