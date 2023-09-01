import type { Either } from '@/shared/either'
import type { ProductNotFoundError, InvalidProductQuantityError } from '../errors'

export type AddProductToCartData = {
  userId: string
  productId: string
  productQty: number
}

export type CartManagerReponse = Either<InvalidProductQuantityError | ProductNotFoundError, null>

export interface CartManager {
  perform: (data: AddProductToCartData) => Promise<CartManagerReponse>
}
