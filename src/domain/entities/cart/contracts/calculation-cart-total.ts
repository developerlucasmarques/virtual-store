import type { CartModel, ProductModel } from '@/domain/models'

export type CalculateCartData = {
  cartModel: CartModel
  products: ProductModel[]
}

export type Total = {
  total: number
}

export interface CalculattionCartTotal {
  execute: (data: CalculateCartData) => Total
}
