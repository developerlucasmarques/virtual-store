import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeAddProductToCartUseCase } from '@/main/factories/usecases/cart'
import type { Controller } from '@/presentation/contracts'
import { AddProductToCartController } from '@/presentation/controllers/cart/add-product-to-cart-controller'
import { makeAddProductToCartValidation } from './add-product-to-cart-validation-factory'

export const makeAddProductToCartController = (): Controller => {
  const controller = new AddProductToCartController(makeAddProductToCartValidation(), makeAddProductToCartUseCase())
  return makeLogControllerDecorator(controller)
}
