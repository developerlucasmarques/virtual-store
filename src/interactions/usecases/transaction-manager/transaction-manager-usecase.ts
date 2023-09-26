import type { EventManager, TransactionEventData, TransactionEventType, TransactionManager, TransactionManagerData, TransactionManagerResponse } from '@/domain/usecases-contracts'
import { OrderNotFoundError, UserMismatchError, UserNotFoundError } from '@/domain/usecases-contracts/errors'
import type { LoadOrderByIdRepo, LoadUserByIdRepo, TransactionListenerGateway } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class TransactionManagerUseCase implements TransactionManager {
  constructor (
    private readonly transactionListenerGateway: TransactionListenerGateway,
    private readonly loadUserByIdRepo: LoadUserByIdRepo,
    private readonly loadOrderByIdRepo: LoadOrderByIdRepo,
    private readonly eventManager: EventManager<TransactionEventType, TransactionEventData>
  ) {}

  async perform (data: TransactionManagerData): Promise<TransactionManagerResponse> {
    const listenerResult = await this.transactionListenerGateway.listener(data)
    if (listenerResult.isLeft()) {
      return left(listenerResult.value)
    }
    const { userId, eventType, orderId } = listenerResult.value
    const user = await this.loadUserByIdRepo.loadById(userId)
    if (!user) {
      return left(new UserNotFoundError())
    }
    const order = await this.loadOrderByIdRepo.loadById(orderId)
    if (!order) {
      return left(new OrderNotFoundError(orderId))
    }
    if (userId !== order.userId) {
      return left(new UserMismatchError())
    }
    const { email: userEmail, name: userName } = user
    const eventResult = await this.eventManager.perform({
      eventType,
      eventData: {
        userId,
        userEmail,
        userName,
        orderCode: 'any_order_code',
        products: [{
          id: 'any_product_id',
          name: 'any name',
          amount: 10.90,
          quantity: 1
        }]
      }
    })
    if (eventResult.isLeft()) {
      return left(eventResult.value)
    }
    return right(null)
  }
}
