import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateTreeDto {
    @IsNotEmpty()
    @IsString()
    name: string
}

export class UpdateTreeDto {
    @IsOptional()
    @IsString()
    name: string
}