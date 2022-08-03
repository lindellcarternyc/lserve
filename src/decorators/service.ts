import { ReflectDecorator } from './reflect-decorator'
import { Token } from '../token'
import { ServiceOptions } from '../types/service-options'

export function Service(): ClassDecorator
export function Service(name: string): ClassDecorator
export function Service<T>(token: Token<T>): ClassDecorator
export function Service<T>(options?: string | Token | ServiceOptions<T>): ClassDecorator {
  return ReflectDecorator<T>(options)
}