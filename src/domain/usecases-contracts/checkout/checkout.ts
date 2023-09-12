import type { Either } from '@/shared/either'
import type { EmptyCartError, ProductNotAvailableError } from '../errors'

export type CheckoutUrl = {
  sessionUrl: string
}

export type CheckoutResponse = Either<EmptyCartError | ProductNotAvailableError, CheckoutUrl>

export interface Checkout {
  perform: (userId: string) => Promise<CheckoutResponse>
}
