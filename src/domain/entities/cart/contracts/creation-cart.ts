import type { CartModel, CompleteCartModel, ProductModel } from '@/domain/models'

export type CreateCartData = {
  cartModel: CartModel
  products: ProductModel[]
}

export interface CreationCart {
  execute: (data: CreateCartData) => CompleteCartModel
}
