import type { CompleteCartModel } from '@/domain/models/complete-cart'
import type { Either } from '@/shared/either'
import type { EmptyCartError, ProductNotAvailableError } from '../errors'

export type LoadCartResponse = Either<EmptyCartError | ProductNotAvailableError, CompleteCartModel>

export interface LoadCart {
  perform: (userId: string) => Promise<LoadCartResponse>
}
