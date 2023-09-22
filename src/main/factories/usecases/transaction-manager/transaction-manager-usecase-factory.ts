import type { TransactionEventData, TransactionEventType, TransactionManager } from '@/domain/usecases-contracts'
import { UserMongoRepo } from '@/external/db/mongo-db/user/user-mongo-repo'
import { StripeAdapter } from '@/external/gateway/stripe/stripe-adapter'
import { TransactionManagerUseCase } from '@/interactions/usecases/transaction-manager'
import env from '@/main/config/env'
import { makeEventManagerUseCase } from '../event-manager/event-manager-usecase-factory'
import { makeAddOrderUseCase } from '../order'

export const makeTransactioManagerUseCase = (): TransactionManager => {
  const stripeAdapter = new StripeAdapter(env.webhookScret)
  const userMongoRepo = new UserMongoRepo()
  const eventConfig = makeEventManagerUseCase<TransactionEventType, TransactionEventData>({
    CheckoutCompleted: [makeAddOrderUseCase()],
    PaymentSuccess: [],
    PaymentFailure: []
  })
  return new TransactionManagerUseCase(stripeAdapter, userMongoRepo, eventConfig)
}
