import { makeLogControllerDecorator } from '@/main/factories/decorators'
import type { Controller } from '@/presentation/contracts'
import { TransactionManagerController } from '@/presentation/controllers/transaction-manager'
import { makeTransactioManagerUseCase } from '../../usecases/transaction-manager/'

export const makeTransactioManagerController = (): Controller => {
  const controller = new TransactionManagerController(makeTransactioManagerUseCase())
  return makeLogControllerDecorator(controller)
}
