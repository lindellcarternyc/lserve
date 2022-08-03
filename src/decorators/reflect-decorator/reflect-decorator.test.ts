import { Container } from '../../container/container'
import { Token } from '../../token'
import { ReflectDecorator } from './reflect-decorator'

describe(ReflectDecorator, () => {
  it('registers a class without a provided id', () => {
    @ReflectDecorator()
    class Test {

    }

    const t1 = Container.get(Test)
    expect(t1).toBeInstanceOf(Test)
  })

  it('registers a class with a token id', () => {
    const token = new Token('a')
    @ReflectDecorator(token)
    class Test {

    }
    const t1 = Container.get(token)
    expect(t1).toBeInstanceOf(Test)
  })

  it('registers a class with an options object', () => {
    @ReflectDecorator({ id: 'hello-world' })
    class Test {

    }

    const t1 = Container.get('hello-world')
    expect(t1).toBeInstanceOf(Test)
  })

  it('registers extra metadata as options', () => {
    @ReflectDecorator(null, { data: 1 })
    class Test {

    }

    const meta = Reflect.getMetadata('options', Test)
    expect(meta).toEqual({ data: 1 })
  })
})
