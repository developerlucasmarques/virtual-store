import type { TransactionEventData, TransactionEventType, TransactionManager } from '@/domain/usecases-contracts'
import { UserMongoRepo } from '@/external/db/mongo-db/user/user-mongo-repo'
import { StripeAdapter } from '@/external/gateway/stripe/stripe-adapter'
import { TransactionManagerUseCase } from '@/interactions/usecases/transaction-manager'
import env from '@/main/config/env'
import { makeEventManagerUseCase } from '../event-manager'
import { OrderMongoRepo } from '@/external/db/mongo-db/order/order-mongo-repo'
import { makeUpdateOrderUseCase } from '../order'

export const makeTransactioManagerUseCase = (): TransactionManager => {
  const stripeAdapter = new StripeAdapter(env.webhookScret)
  const userMongoRepo = new UserMongoRepo()
  const orderMongoRepo = new OrderMongoRepo()
  const eventManagerUseCase = makeEventManagerUseCase<TransactionEventType, TransactionEventData>({
    CheckoutCompleted: [
      makeUpdateOrderUseCase({ status: 'Processing', paymentStatus: 'Payment_Pending' })
    ],
    PaymentSuccess: [],
    PaymentFailure: []
  })
  return new TransactionManagerUseCase(
    stripeAdapter, userMongoRepo, orderMongoRepo, eventManagerUseCase
  )
}
