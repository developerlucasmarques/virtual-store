export type CreateCartRepoData = {
  id: string
  userId: string
  productId: string
  productQty: number
}

export interface CreateCartRepo {
  create: (data: CreateCartRepoData) => Promise<void>
}
