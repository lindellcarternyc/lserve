import express from 'express'
import { Container } from '../container/container'
import { Callable } from '../types/callable'

interface PlatformServer {
  start(fn?: (app: express.Application) => void): Promise<void>
  stop(fn?: () => void): void
  app: express.Application
  address(): {
    port: number
  }
}

interface PlatformConfig {
  port: number
}

const DefaultConfig: PlatformConfig = {
  port: 1234
}

export class Platform {
  private static readonly app: express.Application = express()
  private static server: ReturnType<express.Application['listen']>

  static bootstrap(): PlatformServer
  static bootstrap(module: Callable<unknown>): PlatformServer
  static bootstrap(module?: Callable<unknown>): PlatformServer {
    Platform.app.get('/', (_, res) => {
      res.send('Hello World!')
    })

    const config = Platform.getConfig(module)

    return {
      start(fn?) {
        return new Promise((res, rej) => {
          try {
            Platform.server = Platform.app.listen(config.port as number, () => {
              if (fn) fn(Platform.app)
              res()
            })
          } catch (err) {
            console.error(err)
            return rej(err)
          }
        })
      },
      stop(fn?) {
        Platform.server.close()
        if (fn) return fn()
      },
      app: Platform.app,
      address() {
        return {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          port: ((Platform.server.address() as any).port)
        }
      }
    }
  }

  private static getConfig(module: Callable<unknown> | undefined): PlatformConfig {
    if (!module) return DefaultConfig

    const serverOptions = Reflect.getMetadata('options', module)
    const serverValue = Container.get(module)
    
    const config = merge(serverOptions, serverValue as Partial<PlatformConfig>, DefaultConfig)

    return config
  }
}

const merge = <T>(obj1: Partial<T>, obj2: Partial<T>, defaults: T): T => {
  const result = (Object.keys(defaults) as (keyof T)[]).reduce((res, key) => {
    if (obj1 && obj1[key]) {
      return {
        ...res,
        [key]: obj1[key]
      }
    } else if (obj2 && obj2[key]) {
      return {
        ...res,
        [key]: obj2
      }
    }
    return {
      ...res,
      [key]: defaults[key]
    }
  }, { } as T)
  return result
}