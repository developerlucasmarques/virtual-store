import { adaptMiddleware, adaptRoute } from '@/main/adapters'
import { makeAddProductToCartController } from '@/main/factories/controllers/cart'
import type { Router } from 'express'
import { makeCustomerMiddleware } from '../middlewares'
import { makeLoadCartController } from '../factories/controllers/cart/load-cart/load-cart-factory'

export default async (router: Router): Promise<void> => {
  router.post(
    '/cart',
    adaptMiddleware(makeCustomerMiddleware()),
    adaptRoute(makeAddProductToCartController())
  )
  router.get(
    '/cart',
    adaptMiddleware(makeCustomerMiddleware()),
    adaptRoute(makeLoadCartController())
  )
}
