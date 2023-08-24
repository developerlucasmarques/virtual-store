export type AccessToken = {
  accessToken: string
}

export interface AccessTokenBuilder {
  perform: (value: string) => Promise<AccessToken>
}
