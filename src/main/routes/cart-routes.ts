import { adaptMiddleware, adaptRoute } from '@/main/adapters'
import { makeAddProductToCartController } from '@/main/factories/controllers/cart'
import type { Router } from 'express'
import { makeCustomerMiddleware } from '../middlewares'

export default async (router: Router): Promise<void> => {
  router.post('/cart', adaptMiddleware(makeCustomerMiddleware()), adaptRoute(makeAddProductToCartController()))
}
