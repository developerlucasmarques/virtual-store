import type { CartModel, CompleteCartModel, ProductModel } from '@/domain/models'

export type CreateCartData = {
  cartModel: CartModel
  products: ProductModel[]
}

export interface CreateCart {
  create: (data: CreateCartData) => CompleteCartModel
}
