export interface FormatEmail<T> {
  execute: (data: T) => Promise<string>
}
