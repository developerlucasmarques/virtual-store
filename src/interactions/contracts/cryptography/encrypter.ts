export type EncrypterData = {
  value: string
  expiresInHours?: number
}

export type Token = {
  token: string
}

export interface Encrypter {
  encrypt: (data: EncrypterData) => Promise<Token>
}
