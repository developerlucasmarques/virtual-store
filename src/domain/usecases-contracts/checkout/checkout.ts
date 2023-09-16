import type { Either } from '@/shared/either'
import type { CheckoutFailureError, EmptyCartError, ProductNotAvailableError } from '../errors'

export type CheckoutResponseValue = {
  url: string
}

export type CheckoutResponse = Either<EmptyCartError | ProductNotAvailableError | CheckoutFailureError, CheckoutResponseValue>

export interface Checkout {
  perform: (userId: string) => Promise<CheckoutResponse>
}
