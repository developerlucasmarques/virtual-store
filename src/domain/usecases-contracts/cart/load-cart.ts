import type { CartWithTotalModel } from '@/domain/models/cart-with-total'
import type { Either } from '@/shared/either'
import type { EmptyCartError, ProductNotAvailableError } from '../errors'

export type LoadCartResponse = Either<EmptyCartError | ProductNotAvailableError, CartWithTotalModel>

export interface LoadCart {
  perform: (userId: string) => Promise<LoadCartResponse>
}
