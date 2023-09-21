import { type Router } from 'express'
import { adaptRoute, stripeAdaptMiddleware } from '../adapters'
import { makeTransactioManagerController } from '../factories/controllers/transaction-manager'
import { makeHeadersCheckMiddleware } from '../factories/middleware'

export default async (router: Router): Promise<void> => {
  router.post(
    '/webhook',
    stripeAdaptMiddleware(makeHeadersCheckMiddleware()),
    adaptRoute(makeTransactioManagerController())
  )
}
