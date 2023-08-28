export type Id = { id: string }

export type DecrypterResponse = null | Id

export interface Decrypter {
  decrypt: (token: string) => Promise<DecrypterResponse>
}
