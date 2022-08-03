import { Platform } from './platform'
import request from 'supertest'
import { Container } from '../container/container'
import { Config } from '../decorators/config/config'

describe(Platform, () => {
  it('exists', () => {
    expect(Platform).toBeDefined()
  })

  describe('#bootstrap', () => {
    it('creates a default server', async () => {
      const server = Platform.bootstrap()
      await server.start()
      
      expect(server).toBeDefined()
      expect(server.address().port).toBe(1234)
      server.stop()
    })
    
    it('creates a server using a provided class', async () => {
      class Server {
        port = 6969
      }

      Container.set(Server)
      const server =  Platform.bootstrap(Server)
      await server.start()
      expect(server.address().port).toBe(6969)
      server.stop()
    })

    it('uses the metadata provided by the config decorator', async () => {
      @Config({
        port: 8989
      })
      class S {
        port = 9999
      }

      const server = Platform.bootstrap(S)
      await server.start()
      expect(server.address().port).toBe(8989)
      server.stop()
    })

    describe('#start', () => {
      it('starts the application', async () => {
        const server = Platform.bootstrap()
        const fn = jest.fn()
        await server.start(fn)
        expect(fn).toBeCalledTimes(1)
        expect(server.address().port).toBe(1234)
        server.stop()
      })

      it('gets requests', (done) => {
        const server = Platform.bootstrap()
        server.start().then(() => {
          request(server.app)
            .get('/', (err, res) => {
              console.log(err)
              console.log(res)
            })
            .expect(200)
            .then(() => {
              server.stop(done)
            })
        })
      })
    })
  })
})