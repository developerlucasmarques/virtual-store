import type { Either } from '@/shared/either'
import type { ProductNotFoundError } from '../errors'
import type { AddProductToCartData } from './cart-manager'

export type AddProductToCartResponse = Either<ProductNotFoundError, null>

export interface AddProductToCart {
  perform: (data: AddProductToCartData) => Promise<AddProductToCartResponse>
}
