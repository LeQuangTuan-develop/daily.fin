import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreateWarehouseDto {
    @IsNotEmpty()
    @IsNumber()
    farmId: number

    @IsNotEmpty()
    @IsString()
    warehouse: string
}

export class UpdateWarehouseDto {
    @IsOptional()
    @IsNumber()
    farmId: number

    @IsOptional()
    @IsString()
    warehouse: string
}