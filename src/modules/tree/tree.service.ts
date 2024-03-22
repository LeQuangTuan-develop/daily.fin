import { Injectable } from '@nestjs/common'
import {InjectDataSource} from "@nestjs/typeorm"
import {DatabaseModule} from "../../database.module"
import {DATABASE} from "../../app.constants"
import {DataSource} from "typeorm"
import {ITree} from "./tree.interface";
import {Farm} from "../../entities";
import {CreateTreeDto, UpdateTreeDto} from "./tree.dto";
import {BusinessException} from "../../app.exception";
import {PagingMetaDto, PagingReqDto, TPagingResDto} from "../../app.paging";

@Injectable()
export class TreeService {
  constructor(
      @InjectDataSource(DatabaseModule.getConnectionName(DATABASE.NAMES.VITEC))
      private vitecDataSource: DataSource,
  ) {}

  async findAll(pagingReqDto: PagingReqDto): Promise<TPagingResDto<ITree>> {
    const [trees, count] = await Promise.all([
      this.vitecDataSource.getRepository(Farm).find({
        where: {
          isValid: true,
        },
        order: {
          id: 'DESC',
        },
        skip: pagingReqDto.skip,
        take: pagingReqDto.take,
      }),
      this.vitecDataSource.getRepository(Farm).count({
        where: {
          isValid: true,
        }
      })
    ])
    return {
      data: trees.map((d) => {
        return {
          id: d.id,
          name: d.name || '',
          createdAt: new Date(d.createdAt).getTime(),
        }
      }),
      pagingMeta: new PagingMetaDto(pagingReqDto, count),
    }
  }

  async findOne(id: number): Promise<ITree> {
    const tree = await this.vitecDataSource.getRepository(Farm).findOne({
      where: {
        id: id,
        isValid: true,
      }
    });

    if (!tree) {
        throw new BusinessException('Warehouse not found')
    }

    return {
      id: tree.id,
      name: tree.name || '',
      createdAt: new Date(tree.createdAt).getTime(),
    }
  }

  async create(createTreeDto: CreateTreeDto) {
    const insertResult = await this.vitecDataSource.getRepository(Farm).insert(createTreeDto)

    if (!insertResult.identifiers.length) {
      throw new BusinessException('Create warehouse failed')
    }

    return insertResult.identifiers[0].id
  }

  async edit(id: number, updateTreeDto: UpdateTreeDto) {
    await this.vitecDataSource.getRepository(Farm).update({
        id: id,
    }, updateTreeDto)
  }

  async remove(id: number) {
    await this.vitecDataSource.getRepository(Farm).update({
        id: id,
    }, {
        isValid: false,
    })
  }
}