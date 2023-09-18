import type { TransactionManager, TransactionManagerData, TransactionManagerResponse } from '@/domain/usecases-contracts'
import { GatewayIncompatibilityError } from '@/domain/usecases-contracts/errors'
import type { TransactionListenerGateway } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class TransactionManagerUseCase implements TransactionManager {
  constructor (private readonly transactionListenerGateway: TransactionListenerGateway) {}

  async perform (data: TransactionManagerData): Promise<TransactionManagerResponse> {
    const listenerResult = await this.transactionListenerGateway.listener(data)
    if (!listenerResult) {
      return left(new GatewayIncompatibilityError())
    }
    return right(null)
  }
}
