import type { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeAddProductController, makeLoadAllProductsController, makeLoadProductByIdController } from '@/main/factories/controllers/product'
import { adaptMiddleware } from '@/main/adapters/express-middleware-adapter'
import { makeAccessControlMiddleware } from '@/main/factories/middleware/access-control-middleware-factory'

export default async (router: Router): Promise<void> => {
  router.post('/product', adaptMiddleware(makeAccessControlMiddleware('admin')), adaptRoute(makeAddProductController()))
  router.get('/product', adaptRoute(makeLoadAllProductsController()))
  router.get('/product/:productId', adaptRoute(makeLoadProductByIdController()))
}
