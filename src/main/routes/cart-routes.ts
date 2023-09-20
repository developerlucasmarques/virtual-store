import { adaptMiddleware, adaptRoute } from '@/main/adapters/express'
import { makeAddProductToCartController, makeLoadCartController } from '@/main/factories/controllers/cart'
import type { Router } from 'express'
import { makeCustomerMiddleware } from '../middlewares'

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
