import { Injectable } from '@nestjs/common'
import {InjectDataSource} from "@nestjs/typeorm"
import {DatabaseModule} from "../../database.module"
import {DATABASE} from "../../app.constants"
import {DataSource} from "typeorm"
import {IFarm} from "./farm.interface";
import {Farm} from "../../entities";
import {CreateFarmDto, UpdateFarmDto} from "./farm.dto";
import {AppError, BusinessException} from "../../app.exception";
import {PagingMetaDto, PagingReqDto, TPagingResDto} from "../../app.paging";

@Injectable()
export class FarmService {
  constructor(
      @InjectDataSource(DatabaseModule.getConnectionName(DATABASE.NAMES.VITEC))
      private vitecDataSource: DataSource,
  ) {}

  async findAll(pagingReqDto: PagingReqDto): Promise<TPagingResDto<IFarm>> {
    const [farms, count] = await Promise.all([
      this.getFarms(pagingReqDto),
      this.countFarms(),
    ])

    return {
      data: farms.map((d) => {
        return {
          id: d.id,
          name: d.name || '',
          createdAt: new Date(d.createdAt).getTime(),
        }
      }),
      pagingMeta: new PagingMetaDto(pagingReqDto, count),
    }
  }

  async findOne(id: number): Promise<IFarm> {
    const farm = await this.vitecDataSource.getRepository(Farm).findOne({
      where: {
        id,
        isValid: true,
      }
    });

    if (!farm) {
        throw new BusinessException(AppError.ECB404, 'Farm not found')
    }

    return {
      id: farm.id,
      name: farm.name || '',
      createdAt: new Date(farm.createdAt).getTime(),
    }
  }

  async create(createFarmDto: CreateFarmDto) {
    const insertResult = await this.vitecDataSource.getRepository(Farm).insert(createFarmDto)

    if (!insertResult.identifiers.length) {
      throw new BusinessException(AppError.ECI500, 'Create farm failed')
    }

    return insertResult.identifiers[0].id
  }

  async edit(id: number, updateFarmDto: UpdateFarmDto) {
    await this.vitecDataSource.getRepository(Farm).update({
        id,
    }, updateFarmDto)
  }

  async remove(id: number) {
    await this.vitecDataSource.getRepository(Farm).update({
        id,
    }, {
        isValid: false,
    })
  }

  private async getFarms(pagingReqDto: PagingReqDto): Promise<Farm[]> {
    return await this.vitecDataSource.getRepository(Farm).find({
      where: {
        isValid: true,
      },
      skip: pagingReqDto.skip,
      take: pagingReqDto.take,
      order: {
        createdAt: 'DESC',
      }
    })
  }

  private async countFarms(): Promise<number> {
    return this.vitecDataSource.getRepository(Farm).count({
      where: {
        isValid: true,
      },
    })
  }
}