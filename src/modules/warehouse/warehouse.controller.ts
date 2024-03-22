import {Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe} from '@nestjs/common'
import { WarehouseService } from './warehouse.service'
import {CreateWarehouseDto, UpdateWarehouseDto} from "./warehouse.dto";
import {IWarehouse} from "./warehouse.interface";
import {isProduction} from "../../utils/shared";
import {CustomParseIntPipe, CustomValidationPipe} from "../../app.pipe";
import {Throttle} from "@nestjs/throttler";
import {ApiTags} from "@nestjs/swagger";
import {PagingReqDto, TPagingResDto} from "../../app.paging";

@ApiTags('Warehouse')
@Throttle(150, 60)
@Controller({
    path: 'warehouse',
    version: '1',
})
export class WarehouseController {
    constructor(private warehouseService: WarehouseService) {}

    @UsePipes(isProduction() ? CustomValidationPipe : ValidationPipe)
    @Post()
    async create(
        @Body() createWarehouseDto: CreateWarehouseDto
    ): Promise<TBaseDto<{ id: number }>> {
        return {
            data: {
                id: await this.warehouseService.create(createWarehouseDto)
            }
        }
    }

    @Get(':id')
    async findOne(
        @Param('id', CustomParseIntPipe) id: number
    ): Promise<IWarehouse> {
        return await this.warehouseService.findOne(id)
    }

    @Get()
    async findAll(
        @Query(ValidationPipe) pagingReqDto: PagingReqDto,
    ): Promise<TPagingResDto<IWarehouse>> {
        return await this.warehouseService.findAll(pagingReqDto)
    }

    @UsePipes(isProduction() ? CustomValidationPipe : ValidationPipe)
    @Put(':id')
    async update(
        @Param('id', CustomParseIntPipe) id: number,
        @Body() updateWarehouseDto: UpdateWarehouseDto,
    ): Promise<object> {
        await this.warehouseService.edit(id, updateWarehouseDto)
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