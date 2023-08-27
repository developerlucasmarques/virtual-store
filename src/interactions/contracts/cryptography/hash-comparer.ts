export type ComparerData = {
  value: string
  hash: string
}

export interface HashComparer {
  comparer: (data: ComparerData) => Promise<boolean>
}
