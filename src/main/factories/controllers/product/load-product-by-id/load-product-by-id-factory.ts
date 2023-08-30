import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeLoadProductByIdUseCase } from '@/main/factories/usecases/product/'
import type { Controller } from '@/presentation/contracts'
import { LoadProductByIdController } from '@/presentation/controllers/product'
import { makeLoadProductByIdValidation } from './load-product-by-id-validation-factory'

export const makeLoadProductByIdController = (): Controller => {
  const controller = new LoadProductByIdController(
    makeLoadProductByIdValidation(),
    makeLoadProductByIdUseCase()
  )
  return makeLogControllerDecorator(controller)
}
