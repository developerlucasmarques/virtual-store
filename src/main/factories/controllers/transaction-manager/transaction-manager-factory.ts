import { makeLogControllerDecorator } from '@/main/factories/decorators'
import type { Controller } from '@/presentation/contracts'
import { TransactionManagerController } from '@/presentation/controllers/transaction-manager'
import { makeTransactionManagerValidation } from './transaction-manager-validation-factory'
import { makeTransactioManagerUseCase } from '../../usecases/transaction-manager/'

export const makeTransactioManagerController = (): Controller => {
  const controller = new TransactionManagerController(
    makeTransactionManagerValidation(), makeTransactioManagerUseCase()
  )
  return makeLogControllerDecorator(controller)
}
