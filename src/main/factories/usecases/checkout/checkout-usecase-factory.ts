import type { Checkout } from '@/domain/usecases-contracts'
import { StripeAdapter } from '@/external/gateway/stripe/stripe-adapter'
import { CheckoutUseCase } from '@/interactions/usecases/checkout'
import { makeLoadCartUseCase } from '../cart'
import { UserMongoRepo } from '@/external/db/mongo-db/user/user-mongo-repo'
import { IdMongo } from '@/external/db/mongo-db/id/id-mongo'
import { PurchaseIntentMongoRepo } from '@/external/db/mongo-db/purchase-intent/purchase-intent-mongo-repo'
import env from '@/main/config/env'
import { OrderCodeGenerator } from '@/external/code/order-code-generator'

export const makeCheckoutUseCase = (): Checkout => {
  const userMongoRepo = new UserMongoRepo()
  const stripeAdapter = new StripeAdapter(env.webhookScret)
  const idMongoBuilder = new IdMongo()
  const orderCodeGenerator = new OrderCodeGenerator()
  const purchaseIntentMongoRepo = new PurchaseIntentMongoRepo()
  return new CheckoutUseCase(
    makeLoadCartUseCase(),
    userMongoRepo,
    stripeAdapter,
    orderCodeGenerator,
    idMongoBuilder,
    purchaseIntentMongoRepo
  )
}
