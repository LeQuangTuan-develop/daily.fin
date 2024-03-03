import { DynamicModule } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { find, map } from 'lodash'
import { DATABASE } from './app.constants'

export type TDatabase = {
  DB: string
  NAME?: string
  CHARSET?: string
}

export class DatabaseModule {
  public static forRoot(): DynamicModule {
    const databases: string[] = map(Object.values(DATABASE.NAMES), 'DB')
    const modules = databases.map((key) => {
      const connection = find<TDatabase>(Object.values(DATABASE.NAMES), {DB: key})
      return TypeOrmModule.forRoot(Object.assign({}, {
        type: 'mssql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        name: process.env.DB_NAME,
        entities: ['dist/entities/**/*{.js,.ts}'],
        database: connection?.NAME || connection?.DB || key,
        autoLoadEntities: true,
        logging:  process.env.ENV == 'local' ? ['query', 'error'] : false,
      }, {charset: connection?.CHARSET}) as TypeOrmModuleOptions)
    })
    return {
      module: DatabaseModule,
      imports: modules,
    }
  }

  public static getConnectionName(dbName: TDatabase): string {
    const _conn = find<TDatabase>(Object.values(DATABASE.NAMES), dbName)
    return _conn ? _conn.NAME || _conn.DB : ''
  }
}
