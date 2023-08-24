export type AccessToken = {
  accessToken: string
}

export interface AccessTokenBuilder {
  build: (value: string) => AccessToken
}
