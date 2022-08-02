export type Callable<T> = {
  new(...args: unknown[]): T
}