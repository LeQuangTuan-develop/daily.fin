import {Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe} from '@nestjs/common'
import { FarmService } from './farm.service'
import {CreateFarmDto, UpdateFarmDto} from "./farm.dto";
import {IFarm} from "./farm.interface";
import {isProduction} from "../../utils/shared";
import {CustomParseIntPipe, CustomValidationPipe} from "../../app.pipe";
import {Throttle} from "@nestjs/throttler";
import {ApiTags} from "@nestjs/swagger";
import {PagingReqDto, TPagingResDto} from "../../app.paging";

@ApiTags('Farm')
@Throttle(150, 60)
@Controller({
    path: 'farm',
    version: '1',
})
export class FarmController {
    constructor(private warehouseService: FarmService) {}

    @UsePipes(isProduction() ? CustomValidationPipe : ValidationPipe)
    @Post()
    async create(
        @Body() createFarmDto: CreateFarmDto
    ): Promise<TBaseDto<{ id: number }>> {
        return {
            data: {
                id: await this.warehouseService.create(createFarmDto)
            }
        }
    }

    @Get(':id')
    async findOne(
        @Param('id', CustomParseIntPipe) id: number
    ): Promise<IFarm> {
        return await this.warehouseService.findOne(id)
    }

    @Get()
    async findAll(
        @Query(ValidationPipe) pagingReqDto: PagingReqDto,
    ): Promise<TPagingResDto<IFarm>> {
        return await this.warehouseService.findAll(pagingReqDto)
    }

    @UsePipes(isProduction() ? CustomValidationPipe : ValidationPipe)
    @Put(':id')
    async update(
        @Param('id', CustomParseIntPipe) id: number,
        @Body() updateFarmDto: UpdateFarmDto,
    ): Promise<object> {
        await this.warehouseService.edit(id, updateFarmDto)
        return {}
    }

    @Delete(':id')
    async remove(
        @Param('id', CustomParseIntPipe) id: number
    ): Promise<object> {
        await this.warehouseService.remove(id);
        return {}
    }
}