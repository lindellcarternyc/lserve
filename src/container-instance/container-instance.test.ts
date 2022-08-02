import { ServiceResolveValueError } from '../errors'
import { Token } from '../token'
import { ServiceIdentifier } from '../types/service-identifier'
import { ContainerInstance } from './container-instance'

import { Service } from '../decorators/service'

describe(ContainerInstance, () => {
  const TEST_CONTAINER_KEY = '__TEST_CONTAINER_KEY__'
  const TEST_STRING_ID = '__TEST_STRING_ID__'
  const TEST_INT_VALUE = 100

  let container: ContainerInstance
  beforeEach(() => {
    container = new ContainerInstance(TEST_CONTAINER_KEY)

  })
  it('exists', () => {
    expect(ContainerInstance).toBeDefined()
  })

  describe('constructor', () => {
    it('creates a container instance with the provided id', () => {
      expect(container instanceof ContainerInstance)
      expect(container.id).toBe(TEST_CONTAINER_KEY)
    })
  })

  describe('#set', () => {
    it('can set any value to a string key', () => {
      const c = container.set(TEST_STRING_ID, 100)
      expect(c).toBe(container)
    })
  })

  describe('#has', () => {
    it('returns false if the service does not exist', () => {
      container.set('another', 100)
      expect(container.has(TEST_STRING_ID)).toBe(false)
    })

    it('returns true if the service does exist', () => {
      container.set(TEST_STRING_ID, null)
      expect(container.has(TEST_STRING_ID)).toBe(true)
    })
  })

  describe('#get', () => {
    it('returns a value if is was explicitly set', () => {
      container.set(TEST_STRING_ID, TEST_INT_VALUE)
      const value = container.get(TEST_STRING_ID)
      expect(value).toBe(TEST_INT_VALUE)
    })
  })

  describe('#set/#get', () => {
    it('works with values and tokens as ids', () => {
      const t1 = new Token<string>('name')
      container.set(t1, 'hello')
      expect(container.get(t1)).toBe('hello')
    })

    it('handles simple classes', () => {
      class TestClass {

      }

      container.set(TestClass)

      const t = container.get(TestClass)

      expect(t instanceof TestClass).toBe(true)
    })

    it('handles a service id object', () => {
      const id: ServiceIdentifier = {
        service: new Token('test')
      }

      expect(() => {
        container.get(id.service)
      }).toThrow()

      container.set(id, undefined)

      expect(() => {
        container.get(id)
      }).toThrowError(ServiceResolveValueError)
    })

    it('handles a type object', () => {
      class Test {

      }

      container.set({ type: Test })

      const t = container.get(Test)

      expect(t instanceof Test).toBe(true)
    })
  })

  describe('constructor resolutions', () => {
    it('resolves on constructor param that has been set to container', () => {
      @Service()
      class Injected { 
        public readonly message = 'I was injected'
      }

      @Service()
      class Dependent {
        constructor(public readonly injected: Injected) {}
      }

      container.set(Injected).set(Dependent)
      const dep = container.get<Dependent>(Dependent)
      expect(dep.injected).toBeDefined()
      expect(dep.injected.message).toBe('I was injected')
    })
  })
})