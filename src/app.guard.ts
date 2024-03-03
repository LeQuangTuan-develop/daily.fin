import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AppError, BusinessException } from './app.exception'

@Injectable()
export class AppGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    return this.validateUser(request) as unknown as boolean
  }

  async validateUser(request): Promise<boolean> {
    const ipAddress =
      request.headers['remote-addr'] ||
      (request.headers['x-forwarded-for'] || '').split(',')[0] ||
      ''
    const userAgent = request.headers['user-agent'] || ''
    const referer = request.headers['referer'] || ''
    const auPayloadHeader = request.headers['au-payload']
    let auPayload
    try {
      auPayload = auPayloadHeader
        ? (JSON.parse(request.headers['au-payload']) as TAuPayload)
        : {}
    } catch (e) {
      throw new BusinessException(AppError.ECB001, 'Bad request')
    }
    request.metaData = {
      ipAddress,
      userAgent,
      referer,
      ...auPayload,
    } as TMetaData
    return true
  }
}
