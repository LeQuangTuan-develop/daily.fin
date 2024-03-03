import * as process from 'process'

function isLocal(): boolean {
  return process.env.ENV == 'local'
}

function isProduction(): boolean {
  return process.env.ENV == 'production'
}

export { isLocal, isProduction }
