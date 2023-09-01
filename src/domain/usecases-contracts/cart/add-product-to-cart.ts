import type { Either } from '@/shared/either'
import type { ProductNotFoundError } from '../errors'

export type AddProductToCartData = {
  productId: string
  qtyProducts: number
}

export type AddProductToCartReponse = Either<ProductNotFoundError, null>

export interface AddProductToCart {
  perform: (data: AddProductToCartData) => Promise<AddProductToCartReponse>
}
