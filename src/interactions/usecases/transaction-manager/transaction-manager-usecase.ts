import type { TransactionManager, TransactionManagerData, TransactionManagerResponse } from '@/domain/usecases-contracts'
import type { TransactionListenerGateway } from '@/interactions/contracts'
import { right } from '@/shared/either'

export class TransactionManagerUseCase implements TransactionManager {
  constructor (private readonly transactionListenerGateway: TransactionListenerGateway) {}

  async perform (data: TransactionManagerData): Promise<TransactionManagerResponse> {
    await this.transactionListenerGateway.listener(data)
    return right({ success: true })
  }
}
