import { Platform } from './platform'
import request from 'supertest'

describe(Platform, () => {
  it('exists', () => {
    expect(Platform).toBeDefined()
  })

  describe('#bootstrap', () => {
    it('creates a default server', () => {
      const server = Platform.bootstrap()
      expect(server).toBeDefined()
    })

    describe('#start', () => {
      it('starts the application', async () => {
        const server = Platform.bootstrap()
        const fn = jest.fn()
        await server.start(fn)
        expect(fn).toBeCalledTimes(1)
        server.stop()
        // done()
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