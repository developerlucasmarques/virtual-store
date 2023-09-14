import type { Checkout } from '@/domain/usecases-contracts'
import { StripeAdapter } from '@/external/gateway/stripe/stripe-adapter'
import { CheckoutUseCase } from '@/interactions/usecases/checkout'
import { makeLoadCartUseCase } from '../cart'

export const makeCheckoutUseCase = (): Checkout => {
  const stripeAdapter = new StripeAdapter()
  return new CheckoutUseCase(makeLoadCartUseCase(), stripeAdapter)
}
