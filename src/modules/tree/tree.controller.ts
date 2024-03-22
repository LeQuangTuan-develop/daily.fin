import {Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe} from '@nestjs/common'
import { TreeService } from './tree.service'
import {CreateTreeDto, UpdateTreeDto} from "./tree.dto";
import {ITree} from "./tree.interface";
import {isProduction} from "../../utils/shared";
import {CustomParseIntPipe, CustomValidationPipe} from "../../app.pipe";
import {Throttle} from "@nestjs/throttler";
import {ApiTags} from "@nestjs/swagger";
import {PagingReqDto, TPagingResDto} from "../../app.paging";

@ApiTags('Type Of Tree')
@Throttle(150, 60)
@Controller({
    path: 'tree',
    version: '1',
})
export class TreeController {
    constructor(private treeService: TreeService) {}

    @UsePipes(isProduction() ? CustomValidationPipe : ValidationPipe)
    @Post()
    async create(
        @Body() createTreeDto: CreateTreeDto
    ): Promise<TBaseDto<{ id: number }>> {
        return {
            data: {
                id: await this.treeService.create(createTreeDto)
            }
        }
    }

    @Get(':id')
    async findOne(
        @Param('id', CustomParseIntPipe) id: number
    ): Promise<ITree> {
        return await this.treeService.findOne(id)
    }

    @Get()
    async findAll(
        @Query(ValidationPipe) pagingReqDto: PagingReqDto,
    ): Promise<TPagingResDto<ITree>> {
        return await this.treeService.findAll(pagingReqDto)
    }

    @UsePipes(isProduction() ? CustomValidationPipe : ValidationPipe)
    @Put(':id')
    async update(
        @Param('id', CustomParseIntPipe) id: number,
        @Body() updateTreeDto: UpdateTreeDto,
    ): Promise<object> {
        await this.treeService.edit(id, updateTreeDto)
        return {}
    }

    @Delete(':id')
    async remove(
        @Param('id', CustomParseIntPipe) id: number
    ): Promise<object> {
        await this.treeService.remove(id);
        return {}
    }
}