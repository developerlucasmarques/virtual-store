export type LoadCartByUserIdRepoResponse = {
  id: string
  userId: string
  productIds: string[]
}

export interface LoadCartByUserIdRepo {
  loadByUserId: (userId: string) => Promise<null | LoadCartByUserIdRepoResponse>
}
