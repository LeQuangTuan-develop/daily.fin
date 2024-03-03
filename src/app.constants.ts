import { TDatabase } from './database.module'

export const RATE_LIMIT_DEFAULT = {
    LIMIT: process.env.ENV == 'production' ? 100 : 500,
    TTL: 2 * 60, // 2 minutes
}

export const DATABASE = {
    NAMES: {
    //   PRIVACY: {
    //     DB: 'privacy',
    //   } as TDatabase,
    //   COMMON: {
    //     DB: 'common',
    //   } as TDatabase,
    //   MASTER: {
    //     DB: 'master',
    //   } as TDatabase,
        VITEC: {
            DB: 'vitec',
        } as TDatabase
    },
  }