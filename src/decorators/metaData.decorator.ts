import {
    createParamDecorator,
    ExecutionContext,
  } from '@nestjs/common'

export const MetaData = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest()
      const metaData = request.metaData
      return data ? metaData?.[data] : metaData
    },
)