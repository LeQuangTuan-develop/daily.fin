import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateMaterialDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    group: string
}

export class UpdateMaterialDto {
    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    group: string
}