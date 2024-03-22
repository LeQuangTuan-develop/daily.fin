import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateFarmDto {
    @IsNotEmpty()
    @IsString()
    name: string
}

export class UpdateFarmDto {
    @IsOptional()
    @IsString()
    name: string
}