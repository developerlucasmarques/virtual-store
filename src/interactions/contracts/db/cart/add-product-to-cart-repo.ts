import type { ProductCartRepoData } from './create-cart-repo'

export type AddProductToCartRepoData = {
  id: string
  product: ProductCartRepoData
}

export interface AddProductToCartRepo {
  addProduct: (data: AddProductToCartRepoData) => Promise<void>
}
