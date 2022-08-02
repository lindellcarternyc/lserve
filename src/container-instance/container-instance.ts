import { ServiceNotFoundError, ServiceResolveValueError } from '../errors'
import { Token } from '../token'
import { Callable } from '../types/callable'
import { ServiceIdentifier } from '../types/service-identifier'
import { ServiceMetadata } from '../types/service-metadata'

export class ContainerInstance {
  constructor(public readonly id: string) {}

  private services: Map<ServiceMetadata, ServiceMetadata> = new Map()

  set<T>(service: ServiceMetadata<T>): this
  set<T>(serviceId: string | Token, value: T): this;
  set<T>(ctor: Callable<T>): this;
  set<T>(idObj: { service: Token<T>}, value: T): this
  set<T>(
    serviceOrId: ServiceMetadata<T> | ServiceIdentifier<T>,
    value?: T
  ): this {
    if (typeof serviceOrId === 'string' || serviceOrId instanceof Token) {
      return this.set({
        id: serviceOrId,
        value,
      })
    }

    if (serviceOrId instanceof Function) {
      return this.set({
        id: serviceOrId,
        type: serviceOrId,
      })
    }

    if (typeof serviceOrId === 'object' && 'service' in serviceOrId) {
      return this.set({
        id: serviceOrId.service,
        value
      })
    }
    const metadata: ServiceMetadata<T> = {
      id: serviceOrId.id,
      value: serviceOrId.value,
      type: serviceOrId.type,
    }

    this.services.set(metadata, metadata)

    return this
  }

  has(id: ServiceIdentifier): boolean {
    return !!this.findService(id)
  }

  get<T>(id: string): T
  get<T>(token: Token<T>): T
  get<T>(ctor: Callable<T>): T
  get<T>(idObj: { service: Token<T>}): T
  get<T>(id: ServiceIdentifier<T>): T {
    const service = this.findService(id)

    if (!service) {
      throw new ServiceNotFoundError(id)
    }

    if (service.value !== undefined) {
      return service.value as T
    }

    if (service.type) {
      const value = new service.type()
      service.value = value
      return value as T
    }

    throw new ServiceResolveValueError(id)
  }

  private findService(identifier: ServiceIdentifier): ServiceMetadata | undefined {
    return Array.from(this.services.values()).find(
      service => {
        if (service.id) {
          if (service.id instanceof Token &&
              typeof identifier === 'object' && 'service' in identifier
          ) {
            return service.id === identifier.service
          }
          return service.id === identifier
        }

        if (service.type && identifier instanceof Function) {
          return service.type === identifier
        }
      }
    )
  }
}