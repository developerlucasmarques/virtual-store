import type { TransactionEventData, TransactionEventType, TransactionManager } from '@/domain/usecases-contracts'
import { UserMongoRepo } from '@/external/db/mongo-db/user/user-mongo-repo'
import { StripeAdapter } from '@/external/gateway/stripe/stripe-adapter'
import { TransactionManagerUseCase } from '@/interactions/usecases/transaction-manager'
import env from '@/main/config/env'
import { makeEventManagerUseCase } from '../event-manager/event-manager-usecase-factory'
import { makeAddOrderUseCase } from '../order'
import { PurchaseIntentMongoRepo } from '@/external/db/mongo-db/purchase-intent/purchase-intent-mongo-repo'

export const makeTransactioManagerUseCase = (): TransactionManager => {
  const stripeAdapter = new StripeAdapter(env.webhookScret)
  const userMongoRepo = new UserMongoRepo()
  const purchaseIntentMongoRepo = new PurchaseIntentMongoRepo()
  const eventConfig = makeEventManagerUseCase<TransactionEventType, TransactionEventData>({
    CheckoutCompleted: [makeAddOrderUseCase('Payment_Pending')],
    PaymentSuccess: [],
    PaymentFailure: []
  })
  return new TransactionManagerUseCase(
    stripeAdapter, userMongoRepo, purchaseIntentMongoRepo, eventConfig
  )
}
