import type { Checkout } from '@/domain/usecases-contracts'
import { UserMongoRepo } from '@/external/db/mongo-db/user/user-mongo-repo'
import { StripeAdapter } from '@/external/gateway/stripe/stripe-adapter'
import { CheckoutUseCase } from '@/interactions/usecases/checkout'
import env from '@/main/config/env'
import { makeLoadCartUseCase } from '../cart'

export const makeCheckoutUseCase = (): Checkout => {
  const userMongoRepo = new UserMongoRepo()
  const stripeAdapter = new StripeAdapter(env.webhookScret)
  return new CheckoutUseCase(makeLoadCartUseCase(), userMongoRepo, stripeAdapter)
}
