export type UpdateAccessTokenData = {
  userId: string
  accessToken: string
}

export interface UpdateAccessTokenRepo {
  updateAccessToken: (data: UpdateAccessTokenData) => Promise<void>
}
