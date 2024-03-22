import { Injectable } from '@nestjs/common'
import {InjectDataSource} from "@nestjs/typeorm"
import {DatabaseModule} from "../../database.module"
import {DATABASE} from "../../app.constants"
import {DataSource} from "typeorm"
import {IMaterial} from "./material.interface";
import {Material} from "../../entities";
import {CreateMaterialDto, UpdateMaterialDto} from "./material.dto";
import {AppError, BusinessException} from "../../app.exception";
import {PagingMetaDto, PagingReqDto, TPagingResDto} from "../../app.paging";

@Injectable()
export class MaterialService {
  constructor(
      @InjectDataSource(DatabaseModule.getConnectionName(DATABASE.NAMES.VITEC))
      private vitecDataSource: DataSource,
  ) {}

  async findAll(pagingReqDto: PagingReqDto): Promise<TPagingResDto<IMaterial>> {
    const [materials, count] = await Promise.all([
      this.vitecDataSource.getRepository(Material).find({
        where: {
          isValid: true,
        },
        order: {
          id: 'DESC',
        },
        skip: pagingReqDto.skip,
        take: pagingReqDto.take,
      }),
      this.vitecDataSource.getRepository(Material).count({
        where: {
          isValid: true,
        }
      })
    ])
    return {
      data: materials.map((m) => {
        return {
          id: m.id,
          name: m.name || '',
          group: m.group || '',
          createdAt: new Date(m.createdAt).getTime(),
        }
      }),
      pagingMeta: new PagingMetaDto(pagingReqDto, count),
    }
  }

  async findOne(id: number): Promise<IMaterial> {
    const material = await this.vitecDataSource.getRepository(Material).findOne({
      where: {
        id,
        isValid: true,
      }
    });

    if (!material) {
        throw new BusinessException(AppError.ECB404, 'Material not found')
    }

    return {
      id: material.id,
      name: material.name || '',
      group: material.group || '',
      createdAt: new Date(material.createdAt).getTime(),
    }
  }

  async create(createMaterialDto: CreateMaterialDto) {
    const insertResult = await this.vitecDataSource.getRepository(Material).insert(createMaterialDto)

    if (!insertResult.identifiers.length) {
      throw new BusinessException(AppError.ECI500, 'Create material failed')
    }

    return insertResult.identifiers[0].id
  }

  async edit(id: number, updateMaterialDto: UpdateMaterialDto) {
    await this.vitecDataSource.getRepository(Material).update({
        id,
    }, updateMaterialDto)
  }

  async remove(id: number) {
    await this.vitecDataSource.getRepository(Material).update({
        id,
    }, {
        isValid: false,
    })
  }
}