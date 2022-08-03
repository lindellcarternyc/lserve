import { ReflectDecorator } from '../reflect-decorator'

interface ConfigOptions {
  port?: number
}

export function Config(options?: ConfigOptions): ClassDecorator {
  return ReflectDecorator(null, options)
}