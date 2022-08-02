import { Token } from '../token'
import { Callable } from './callable'

export type ServiceIdentifier<T = unknown> = 
  | string
  | Token<T>
  | Callable<T>
  | { service: Token<T> }