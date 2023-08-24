export type AccessToken = {
  accesToken: string
}

export interface AccessTokenBuilder {
  build: (value: string) => AccessToken
}
