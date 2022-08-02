export type Callable<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new(...args: any[]): T
}