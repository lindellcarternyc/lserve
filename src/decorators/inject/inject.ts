import { Container } from '../../container/container'
import { Token } from '../../token'
import { Callable } from '../../types/callable'
import { ServiceIdentifier } from '../../types/service-identifier'

type InjectType<T> = () => Callable<T>

type TypeOrName<T> = 
  | string
  | Token<T>
  | InjectType<T>

  // eslint-disable-next-line @typescript-eslint/ban-types
  const getIdentifier = <T>(typeOrName: TypeOrName<T>, target: Object, propName: string | symbol) => {
    let identifier: ServiceIdentifier<T> | undefined

    if (typeof typeOrName === 'string') {
      identifier = typeOrName
    } else if (typeOrName instanceof Token) {
      identifier = typeOrName
    } else if (typeof typeOrName === 'function') {
      identifier = typeOrName()
    }

    if (!identifier) {
      throw new Error(`Cannot get identifier for ${typeOrName.toString()}, ${target} ${propName.toString()}`)
    }

    return identifier
  }

export function Inject(serviceName: string): PropertyDecorator
export function Inject<T>(token: Token<T>): PropertyDecorator
export function Inject<T>(ctor: Callable<T>): PropertyDecorator
export function Inject<T>(type?: () => Callable<T>): PropertyDecorator
export function Inject<T>(typeOrName?: TypeOrName<T>): PropertyDecorator {
  return (target, propName) => {
    if (!typeOrName) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      typeOrName = () => (Reflect as any).getMetadata('design:type',target, propName)
    }

    const identifier = getIdentifier(typeOrName, target, propName)
    
    Container.registerHandler({
      object: target,
      propName: propName.toString(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: instance => instance.get<T>(identifier as any)
    })
  }
}