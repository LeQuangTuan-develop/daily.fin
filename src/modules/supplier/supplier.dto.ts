import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateSupplierDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    address: string

    @IsOptional()
    @IsString()
    phoneNumber: string

    @IsOptional()
    @IsString()
    testResult: string
}

export class UpdateSupplierDto {
    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    address: string

    @IsOptional()
    @IsString()
    phoneNumber: string

    @IsOptional()
    @IsString()
    testResult: string
}