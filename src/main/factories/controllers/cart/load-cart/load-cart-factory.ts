import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeLoadCartUseCase } from '@/main/factories/usecases/cart'
import type { Controller } from '@/presentation/contracts'
import { LoadCartController } from '@/presentation/controllers/cart'

export const makeLoadCartController = (): Controller => {
  const controller = new LoadCartController(makeLoadCartUseCase())
  return makeLogControllerDecorator(controller)
}
