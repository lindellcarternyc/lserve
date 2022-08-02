import { ServiceIdentifier } from './types/service-identifier'

export class ServiceNotFoundError extends Error {
  constructor(id: ServiceIdentifier) {
    super(`Could not find service with id: '${id.toString()}'`)
  }
}

export class ServiceResolveValueError extends Error {
  constructor(id: ServiceIdentifier) {
    const message = `Could not resolve value for service with id: ${id.toString()}`
    super(message)
  }
}
