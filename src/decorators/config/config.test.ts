import { Config } from './config'

describe(Config, () => {
  it('sets extra metadata on a class', () => {
    @Config({
      port: 9876
    })
    class Server {

    }

    const options = (Reflect).getMetadata('options', Server)
    expect(options.port).toBe(9876)
  })
})