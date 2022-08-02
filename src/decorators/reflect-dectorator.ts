import { Container } from '../container/container'
import { Token } from '../token'
import { Callable } from '../types/callable'
import { ServiceMetadata } from '../types/service-metadata'
import { ServiceOptions } from '../types/service-options'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ReflectDecorator<T>(options?: any): ClassDecorator {
  return target => {
    const service: ServiceMetadata<T> = {
      type: target as unknown as Callable<T>
    }

    if (typeof options === 'string' || options instanceof Token) {
      service.id = options
    } else if (options) {
      service.id = (options as ServiceOptions<T>).id
    }

    Container.set(service)
  }
}