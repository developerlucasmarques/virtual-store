export type ProductCartRepoData = {
  id: string
  quantity: number
}

export type CreateCartRepoData = {
  id: string
  userId: string
  product: ProductCartRepoData
}

export interface CreateCartRepo {
  create: (data: CreateCartRepoData) => Promise<void>
}
