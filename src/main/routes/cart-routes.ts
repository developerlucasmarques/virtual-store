import type { Router } from 'express'
import { adaptMiddleware, adaptRoute } from '@/main/adapters'
import { makeAddProductToCartController } from '@/main/factories/controllers/cart'
import { makeAccessControlMiddleware } from '@/main/factories/middleware/access-control-middleware-factory'

export default async (router: Router): Promise<void> => {
  router.post('/cart', adaptMiddleware(makeAccessControlMiddleware('customer')), adaptRoute(makeAddProductToCartController()))
}
