import { Container } from '../../container/container'
import { Token } from '../../token'
import { Service } from '../service'
import { Inject } from './inject'

describe(Inject, () => {
  it('injects class property', () => {
    const tk1 = new Token<S>('TOKEN1')

    @Service()
    class Injectable {
      public readonly message = 'I was injected'
    }

    @Service('inj')
    class Inj {
      public log(item: { message: string }) {
        console.log(item.message)
      }
    }

    @Service(tk1)
    class S {

    }

    @Service()
    class Dependent {
      @Inject()
      injectable!: Injectable

      @Inject('inj')
      inj!: Inj

      @Inject(tk1)
      s!: S

      log() {
        this.inj.log(this.injectable)
        console.log(this.s)
      }
    }

    const dep: Dependent = Container.get(Dependent)
    expect(dep.injectable).toBeDefined()
    dep.log()

  })
})