import {Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe} from '@nestjs/common'
import { MaterialService } from './material.service'
import {CreateMaterialDto, UpdateMaterialDto} from "./material.dto";
import {IMaterial} from "./material.interface";
import {isProduction} from "../../utils/shared";
import {CustomParseIntPipe, CustomValidationPipe} from "../../app.pipe";
import {Throttle} from "@nestjs/throttler";
import {ApiTags} from "@nestjs/swagger";
import {PagingReqDto, TPagingResDto} from "../../app.paging";

@ApiTags('Material')
@Throttle(150, 60)
@Controller({
    path: 'material',
    version: '1',
})
export class MaterialController {
    constructor(private materialService: MaterialService) {}

    @UsePipes(isProduction() ? CustomValidationPipe : ValidationPipe)
    @Post()
    async create(
        @Body() createMaterialDto: CreateMaterialDto
    ): Promise<TBaseDto<{ id: number }>> {
        return {
            data: {
                id: await this.materialService.create(createMaterialDto)
            }
        }
    }

    @Get(':id')
    async findOne(
        @Param('id', CustomParseIntPipe) id: number
    ): Promise<IMaterial> {
        return await this.materialService.findOne(id)
    }

    @Get()
    async findAll(
        @Query(ValidationPipe) pagingReqDto: PagingReqDto,
    ): Promise<TPagingResDto<IMaterial>> {
        return await this.materialService.findAll(pagingReqDto)
    }

    @UsePipes(isProduction() ? CustomValidationPipe : ValidationPipe)
    @Put(':id')
    async update(
        @Param('id', CustomParseIntPipe) id: number,
        @Body() updateMaterialDto: UpdateMaterialDto,
    ): Promise<object> {
        await this.materialService.edit(id, updateMaterialDto)
        return {}
    }

    @Delete(':id')
    async remove(
        @Param('id', CustomParseIntPipe) id: number
    ): Promise<object> {
        await this.materialService.remove(id);
        return {}
    }
}