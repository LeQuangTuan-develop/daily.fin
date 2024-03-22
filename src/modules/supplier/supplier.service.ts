import { Injectable } from '@nestjs/common'
import {InjectDataSource} from "@nestjs/typeorm"
import {DatabaseModule} from "../../database.module"
import {DATABASE} from "../../app.constants"
import {DataSource} from "typeorm"
import {ISupplier} from "./supplier.interface";
import {Supplier} from "../../entities";
import {CreateSupplierDto, UpdateSupplierDto} from "./supplier.dto";
import {AppError, BusinessException} from "../../app.exception";
import {PagingMetaDto, PagingReqDto, TPagingResDto} from "../../app.paging";

@Injectable()
export class SupplierService {
  constructor(
      @InjectDataSource(DatabaseModule.getConnectionName(DATABASE.NAMES.VITEC))
      private vitecDataSource: DataSource,
  ) {}

  async findAll(pagingReqDto: PagingReqDto): Promise<TPagingResDto<ISupplier>> {
    const [suppliers, count] = await Promise.all([
      this.vitecDataSource.getRepository(Supplier).find({
        where: {
          isValid: true,
        },
        order: {
            id: 'DESC',
        },
        skip: pagingReqDto.skip,
        take: pagingReqDto.take,
      }),
      this.vitecDataSource.getRepository(Supplier).count({
        where: {
          isValid: true,
        }
      })
    ])
    return {
      data: suppliers.map((supplier) => {
        return {
          id: supplier.id,
          name: supplier.name || '',
          address: supplier.address || '',
          phoneNumber: supplier.phoneNumber || '',
          createdAt: new Date(supplier.createdAt).getTime(),
        }
      }),
      pagingMeta: new PagingMetaDto(pagingReqDto, count),
    }
  }

  async findOne(id: number): Promise<ISupplier> {
    const supplier = await this.vitecDataSource.getRepository(Supplier).findOne({
      where: {
        id,
        isValid: true,
      }
    });

    if (!supplier) {
      throw new BusinessException(AppError.ECB404, 'Supplier not found')
    }

    return {
      id: supplier.id,
      name: supplier.name || '',
      address: supplier.address || '',
      phoneNumber: supplier.phoneNumber || '',
      createdAt: new Date(supplier.createdAt).getTime(),
    }
  }

  async create(createSupplierDto: CreateSupplierDto) {
    const insertResult = await this.vitecDataSource.getRepository(Supplier).insert(createSupplierDto)

    if (!insertResult.identifiers.length) {
      throw new BusinessException(AppError.ECI500, 'Create farm failed')
    }

    return insertResult.identifiers[0].id
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