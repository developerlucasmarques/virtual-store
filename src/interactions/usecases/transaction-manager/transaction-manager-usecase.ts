import type { TransactionManager, TransactionManagerData, TransactionManagerResponse } from '@/domain/usecases-contracts'
import { GatewayIncompatibilityError } from '@/domain/usecases-contracts/errors'
import type { LoadUserByIdRepo, TransactionListenerGateway } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class TransactionManagerUseCase implements TransactionManager {
  constructor (
    private readonly transactionListenerGateway: TransactionListenerGateway,
    private readonly loadUserByIdRepo: LoadUserByIdRepo
  ) {}

  async perform (data: TransactionManagerData): Promise<TransactionManagerResponse> {
    const listenerResult = await this.transactionListenerGateway.listener(data)
    if (!listenerResult) {
      return left(new GatewayIncompatibilityError())
    }
    await this.loadUserByIdRepo.loadById(listenerResult.userId)
    return right(null)
  }
}
