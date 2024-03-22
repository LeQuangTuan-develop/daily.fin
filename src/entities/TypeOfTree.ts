import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("TypeOfTree", { schema: "dbo" })
export class TypeOfTree {
  @PrimaryGeneratedColumn({ type: "int", name: "TypeOfTreeID" })
  typeOfTreeId: number;

  @Column("nvarchar", { name: "TypeOfTree", nullable: true, length: 100 })
  typeOfTree: string | null;

  @Column("datetime2", { name: "CreatedAt", default: () => "getdate()" })
  createdAt: Date;

  @Column("datetime2", { name: "UpdatedAt" })
  updatedAt: Date;

  @Column("datetime2", { name: "UpdatedAt2" })
  updatedAt2: Date;
}
