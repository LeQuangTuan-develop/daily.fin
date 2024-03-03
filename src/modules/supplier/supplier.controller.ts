import {Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe} from '@nestjs/common'
import { SupplierService } from './supplier.service'
import {CreateSupplierDto, UpdateSupplierDto} from "./supplier.dto";
import {ISupplier} from "./supplier.interface";
import {isProduction} from "../../utils/shared";
import {CustomParseIntPipe, CustomValidationPipe} from "../../app.pipe";
import {Throttle} from "@nestjs/throttler";

@Throttle(150, 60)
@Controller({
    path: 'supplier',
    version: '1',
})
export class SupplierController {
    constructor(private supplierService: SupplierService) {}

    @UsePipes(isProduction() ? CustomValidationPipe : ValidationPipe)
    @Post()
    async create(
        @Body() createSupplierDto: CreateSupplierDto
    ): Promise<object> {
        await this.supplierService.create(createSupplierDto)
        return {}
    }

    @Get(':id')
    async findOne(
        @Param('id', CustomParseIntPipe) id: number
    ): Promise<ISupplier> {
        return await this.supplierService.findOne(id)
    }

    @Get()
    async findAll(): Promise<ISupplier[]> {
        return await this.supplierService.findAll()
    }

    @UsePipes(isProduction() ? CustomValidationPipe : ValidationPipe)
    @Put(':id')
    async update(
        @Param('id', CustomParseIntPipe) id: number,
        @Body() updateSupplierDto: UpdateSupplierDto,
    ): Promise<object> {
        await this.supplierService.edit(id, updateSupplierDto)
        return {}
    }

    @Delete(':id')
    async remove(
        @Param('id', CustomParseIntPipe) id: number
    ): Promise<object> {
        await this.supplierService.remove(id);
        return {}
    }
}