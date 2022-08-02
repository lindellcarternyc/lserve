import { Token } from '../token'
import { Callable } from './callable'

export interface ServiceMetadata<T = unknown> {
  id?: string | Token<T> | Callable<T>
  value?: T
  type?: Callable<T>
}