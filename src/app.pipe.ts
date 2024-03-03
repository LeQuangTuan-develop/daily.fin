import {
    BadRequestException,
    ParseIntPipe,
    PipeTransform,
    ValidationPipe,
} from '@nestjs/common'
import { ValidationPipeOptions } from '@nestjs/common/pipes/validation.pipe'
import {AppError} from "./app.exception";
/**
 * GgjParseIntPipe for validating input param
 */
export class CustomParseIntPipe extends ParseIntPipe {
    constructor(message?: string, error?: string) {
        super({
            exceptionFactory: () => {
                return new BadRequestException(
                    message || 'Bad Request',
                    error || AppError.ECB001,
                )
            },
        })
    }
}

export class CustomValidationPipe extends ValidationPipe {
    constructor(options?: ValidationPipeOptions) {
        super(
            Object.assign(
                {},
                {
                    exceptionFactory: () => {
                        return new BadRequestException('Bad Request', AppError.ECB001)
                    },
                },
                options || {},
            ),
        )
    }
}

export class CustomNonEmptyStringPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) {
            throw new BadRequestException('Bad Request', AppError.ECB001)
        }
        return value
    }
}
