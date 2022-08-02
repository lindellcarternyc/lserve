import { ContainerInstance } from '../container-instance'

export interface Handler<T> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  object: Object,
  propName: string
  value: (container: ContainerInstance) => T
}