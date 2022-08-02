import { Token } from '../token'

export interface ServiceOptions<T> {
  id?: string | Token<T>
}
