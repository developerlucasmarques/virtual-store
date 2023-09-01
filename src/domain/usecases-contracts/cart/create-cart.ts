import type { Either } from '@/shared/either'
import type { AddProductToCartData } from './cart-manager'
import type { ProductNotFoundError } from '../errors'

export type CreateCartReponse = Either<ProductNotFoundError, null>

export interface CreateCart {
  perform: (data: AddProductToCartData) => Promise<CreateCartReponse>
}
