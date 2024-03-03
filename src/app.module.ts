import {
    DynamicModule,
    Global,
    MiddlewareConsumer,
    Module,
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'
import { ThrottlerModule } from '@nestjs/throttler'
import { RATE_LIMIT_DEFAULT } from './app.constants'
import { XssProtectionMiddleware } from './middlewares/xssProtection'
import { DatabaseModule } from './database.module'

@Global()
@Module({})
export class AppModule {
    static forRoot(modules): DynamicModule {
      return {
        module: AppModule,
        imports: [
          ConfigModule.forRoot(),
          DatabaseModule.forRoot(),
          HttpModule,
          ...modules,
          // DDOS protection
          ThrottlerModule.forRoot({
            limit: RATE_LIMIT_DEFAULT.LIMIT,
            ttl: RATE_LIMIT_DEFAULT.TTL,
            ignoreUserAgents: [/(Chrome-Lighthouse|bot)/i],
          }),
        ],
        providers: [],
        exports: [],
      }
    }
  
    configure(consumer: MiddlewareConsumer) {
    //   consumer.apply(MypageMiddleware).forRoutes('/api/skijan/v*/mypage/*')
      consumer
        .apply(XssProtectionMiddleware)
        .forRoutes('/api/vitec/v*/*')
    }
}
  