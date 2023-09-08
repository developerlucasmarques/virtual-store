import type { AddProductToCartRepoData } from './add-product-to-cart-repo'

export type UpdateProductQtyCartRepoData = AddProductToCartRepoData

export interface UpdateProductQtyCartRepo {
  updateProductQty: (data: UpdateProductQtyCartRepoData) => Promise<void>
}
