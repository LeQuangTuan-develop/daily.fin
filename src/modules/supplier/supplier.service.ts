import { Injectable } from '@nestjs/common'
import {InjectDataSource} from "@nestjs/typeorm"
import {DatabaseModule} from "../../database.module"
import {DATABASE} from "../../app.constants"
import {DataSource} from "typeorm"
import {ISupplier} from "./supplier.interface";
import {Supplier} from "../../entities";
import {CreateSupplierDto, UpdateSupplierDto} from "./supplier.dto";

@Injectable()
export class SupplierService {
  constructor(
      @InjectDataSource(DatabaseModule.getConnectionName(DATABASE.NAMES.VITEC))
      private vitecDataSource: DataSource,
  ) {}

  async findAll(): Promise<ISupplier[]> {
    const demo = await this.vitecDataSource.getRepository(Supplier).find({
      where: {
        isValid: true,
      }
    });
    return demo.map((d) => {
      return {
        id: d.id,
        name: d.name || '',
        address: d.address || '',
        phoneNumber: d.phoneNumber || '',
        createdAt: new Date(d.createdAt).getTime(),
      }
    })
  }

  async findOne(id: number): Promise<ISupplier> {
    const demo = await this.vitecDataSource.getRepository(Supplier).findOne({
      where: {
        id,
        isValid: true,
      }
    });

    if (!demo) {
        return {} as ISupplier
    }

    return {
      id: demo.id,
      name: demo.name || '',
      address: demo.address || '',
      phoneNumber: demo.phoneNumber || '',
      createdAt: new Date(demo.createdAt).getTime(),
    }
  }

  async create(createSupplierDto: CreateSupplierDto) {
    await this.vitecDataSource.getRepository(Supplier).save(createSupplierDto)
  }

  async edit(id: number, updateSupplierDto: UpdateSupplierDto) {
    await this.vitecDataSource.getRepository(Supplier).update({
        id,
    }, updateSupplierDto)
  }

  async remove(id: number) {
    await this.vitecDataSource.getRepository(Supplier).update({
        id,
    }, {
        isValid: false,
    })
  }
}