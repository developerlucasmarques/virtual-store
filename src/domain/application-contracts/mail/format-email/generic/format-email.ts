export type FormatEmailResponse = {
  html: string
}

export interface FormatEmail<T> {
  execute: (data: T) => FormatEmailResponse
}
