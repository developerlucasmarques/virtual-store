import type { Either } from '@/shared/either'
import type { ProductNotFoundError, InvalidProductQuantityError } from '../errors'

export type AddProductToCartData = {
  userId: string
  productId: string
  productQty: number
}

export type AddProductToCartReponse = Either<InvalidProductQuantityError | ProductNotFoundError, null>

export interface AddProductToCart {
  perform: (data: AddProductToCartData) => Promise<AddProductToCartReponse>
}
