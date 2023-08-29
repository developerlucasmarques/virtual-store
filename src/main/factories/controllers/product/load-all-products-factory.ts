import { makeLogControllerDecorator } from '@/main/factories/decorators'
import type { Controller } from '@/presentation/contracts'
import { LoadAllProductsController } from '@/presentation/controllers/product/load-all-products-controller'
import { makeLoadAllProductsUseCase } from '../../usecases/product'

export const makeLoadAllProductsController = (): Controller => {
  const controller = new LoadAllProductsController(makeLoadAllProductsUseCase())
  return makeLogControllerDecorator(controller)
}
