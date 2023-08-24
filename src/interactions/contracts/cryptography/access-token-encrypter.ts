export type EncrypterData = {
  value: string
  expiresInHours?: number
}

export type Token = {
  token: string
}

export interface Ecrypter {
  encrypt: (data: EncrypterData) => Promise<Token>
}
