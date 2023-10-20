export interface Event<T> {
  requiredProps: Array<keyof T>
  perform: (data: T) => Promise<void>
}
