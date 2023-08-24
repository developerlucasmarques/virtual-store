export type AccessTokenEcrypterData = {
  value: string
  expiresInHours: number
}

export type AccessToken = {
  accessToken: string
}

export interface AccessTokenEcrypter {
  encryptAccessToken: (data: AccessTokenEcrypterData) => AccessToken
}
