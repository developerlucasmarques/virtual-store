import { makeLogControllerDecorator } from '@/main/factories/decorators'
import type { Controller } from '@/presentation/contracts'
import { AddProductController } from '@/presentation/controllers/product'
import { makeAddProductUseCase } from '../../usecases/product'
import { makeAddProductValidation } from './add-product-validation-factory'

export const makeAddProductController = (): Controller => {
  const controller = new AddProductController(makeAddProductValidation(), makeAddProductUseCase())
  return makeLogControllerDecorator(controller)
}
