import type { Either } from '@/shared/either'
import type { InvalidProductQuantityError, ProductNotFoundError } from '../errors'

export type AddProductToCartData = {
  userId: string
  productId: string
  productQty: number
}

export type AddProductToCartResponse = Either<InvalidProductQuantityError | ProductNotFoundError, null>

export interface AddProductToCart {
  perform: (data: AddProductToCartData) => Promise<AddProductToCartResponse>
}
