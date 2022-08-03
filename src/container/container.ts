import { ContainerInstance } from '../container-instance'
import { Token } from '../token'
import { Callable } from '../types/callable'
import { Handler } from '../types/handler'
import { ServiceIdentifier } from '../types/service-identifier'
import { ServiceMetadata } from '../types/service-metadata'

export class Container {
  private static  _globalInstance: ContainerInstance

  public static get globalInstance(): ContainerInstance {
    if (!this._globalInstance) {
      this._globalInstance = new ContainerInstance('GLOABL_INSTANCE')
    }

    return this._globalInstance
  }

  public static readonly handlers: Map<Handler<unknown>, Handler<unknown>> = new Map()

  public static registerHandler<T>(handler: Handler<T>) {
    this.handlers.set(handler, handler)
  }

  public static set<T>(service: ServiceMetadata<T>): void
  public static set<T>(serviceId: string | Token, value: T): void
  public static set<T>(ctor: Callable<T>): void
  public static set<T>(idObj: { service: Token<T> }, value: T): void
  public static set<T>(
    serviceOrId: ServiceMetadata<T> | ServiceIdentifier<T>,
    value?: T
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Container.globalInstance.set(serviceOrId as any, value)
  }

  public static get<T>(id: string): T;
  public static get<T>(token: Token<T>): T;
  public static get<T>(ctor: Callable<T>): T;
  public static get<T>(idObj: { service: Token<T> }): T;
  public static get<T>(id: string | Token<T> | Callable<T> | { service: Token<T> }): T {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.globalInstance.get(id as any)
  }
}