export type Hash = {
  hash: string
}

export interface Hasher {
  hashing: (value: string) => Promise<Hash>
}
