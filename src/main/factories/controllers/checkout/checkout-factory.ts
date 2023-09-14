import { makeLogControllerDecorator } from '@/main/factories/decorators'
import type { Controller } from '@/presentation/contracts'
import { CheckoutController } from '@/presentation/controllers/checkout'
import { makeCheckoutUseCase } from '@/main/factories/usecases/checkout'

export const makeCheckoutController = (): Controller => {
  const controller = new CheckoutController(makeCheckoutUseCase())
  return makeLogControllerDecorator(controller)
}
