import type { Router } from 'express'
import { adaptMiddleware, adaptRoute } from '../adapters'
import { makeCustomerMiddleware } from '../middlewares'
import { makeCheckoutController } from '../factories/controllers/checkout'

export default async (router: Router): Promise<void> => {
  router.get(
    '/checkout',
    adaptMiddleware(makeCustomerMiddleware()),
    adaptRoute(makeCheckoutController())
  )
}
