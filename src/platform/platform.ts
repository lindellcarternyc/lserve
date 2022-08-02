import express from 'express'
import { Server } from 'http'

interface PlatformServer {
  start(fn?: (app: express.Application) => void): Promise<void>
  stop(fn?: () => void): void
  app: express.Application
}

export class Platform {
  private static readonly app: express.Application = express()
  private static server: Server

  
  static bootstrap(): PlatformServer {
    Platform.app.get('/', (_, res) => {
      res.send('Hello World!')
    })
    return {
      start(fn?) {
        return new Promise((res, rej) => {
          try {
            Platform.server = Platform.app.listen(1234, () => {
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
      app: Platform.app
    }
  }
}