import type { EventManager, TransactionManager, TransactionManagerData, TransactionManagerResponse } from '@/domain/usecases-contracts'
import { GatewayIncompatibilityError, UserNotFoundError } from '@/domain/usecases-contracts/errors'
import type { LoadUserByIdRepo, TransactionListenerGateway } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class TransactionManagerUseCase implements TransactionManager {
  constructor (
    private readonly transactionListenerGateway: TransactionListenerGateway,
    private readonly loadUserByIdRepo: LoadUserByIdRepo,
    private readonly eventManager: EventManager
  ) {}

  async perform (data: TransactionManagerData): Promise<TransactionManagerResponse> {
    const listenerResult = await this.transactionListenerGateway.listener(data)
    if (!listenerResult) {
      return left(new GatewayIncompatibilityError())
    }
    const user = await this.loadUserByIdRepo.loadById(listenerResult.userId)
    if (!user) {
      return left(new UserNotFoundError())
    }
    await this.eventManager.perform({
      eventName: listenerResult.eventName,
      eventData: {
        purchaseIntentId: listenerResult.purchaseIntentId,
        userId: user.id,
        userEmail: user.email,
        userName: user.name
      }
    })
    return right(null)
  }
}
