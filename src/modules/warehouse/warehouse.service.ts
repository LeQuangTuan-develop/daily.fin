import { Injectable } from '@nestjs/common'
import {InjectDataSource} from "@nestjs/typeorm"
import {DatabaseModule} from "../../database.module"
import {DATABASE} from "../../app.constants"
import {DataSource} from "typeorm"
import {IWarehouse} from "./warehouse.interface";
import {TypeOfTree} from "../../entities";
import {CreateWarehouseDto, UpdateWarehouseDto} from "./warehouse.dto";
import {BusinessException} from "../../app.exception";
import {PagingMetaDto, PagingReqDto, TPagingResDto} from "../../app.paging";

@Injectable()
export class WarehouseService {
  constructor(
      @InjectDataSource(DatabaseModule.getConnectionName(DATABASE.NAMES.VITEC))
      private vitecDataSource: DataSource,
  ) {}

  async findAll(pagingReqDto: PagingReqDto): Promise<TPagingResDto<IWarehouse>> {
    const [warehouses, count] = await Promise.all([
      this.vitecDataSource.getRepository(TypeOfTree).find({
        where: {
          isValid: true,
        },
        order: {
          id: 'DESC',
        },
        skip: pagingReqDto.skip,
        take: pagingReqDto.take,
      }),
      this.vitecDataSource.getRepository(TypeOfTree).count({
        where: {
          isValid: true,
        }
      })
    ])
    return {
      data: warehouses.map((d) => {
        return {
          id: d.id,
          warehouse: d.name || '',
          farmId: d.farmId || 0,
          createdAt: new Date(d.createdAt).getTime(),
        }
      }),
      pagingMeta: new PagingMetaDto(pagingReqDto, count),
    }
  }

  async findOne(id: number): Promise<IWarehouse> {
    const warehouse = await this.vitecDataSource.getRepository(TypeOfTree).findOne({
      where: {
        id: id,
        isValid: true,
      }
    });

    if (!warehouse) {
        throw new BusinessException('Warehouse not found')
    }

    return {
      id: warehouse.id,
      warehouse: warehouse.name || '',
      farmId: warehouse.farmId || 0,
      createdAt: new Date(warehouse.createdAt).getTime(),
    }
  }

  async create(createWarehouseDto: CreateWarehouseDto) {
    const insertResult = await this.vitecDataSource.getRepository(TypeOfTree).insert(createWarehouseDto)

    if (!insertResult.identifiers.length) {
      throw new BusinessException('Create warehouse failed')
    }

    return insertResult.identifiers[0].id
  }

  async edit(id: number, updateWarehouseDto: UpdateWarehouseDto) {
    await this.vitecDataSource.getRepository(TypeOfTree).update({
        id: id,
    }, updateWarehouseDto)
  }

  async remove(id: number) {
    await this.vitecDataSource.getRepository(TypeOfTree).update({
        id: id,
    }, {
        isValid: false,
    })
  }
}