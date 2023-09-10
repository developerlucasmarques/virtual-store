import type { Router } from 'express'
import { adaptMiddleware, adaptRoute } from '@/main/adapters'
import { makeAddProductController, makeLoadAllProductsController, makeLoadProductByIdController } from '@/main/factories/controllers/product'
import { makeAccessControlMiddleware } from '@/main/factories/middleware/access-control-middleware-factory'

export default async (router: Router): Promise<void> => {
  router.post('/product', adaptMiddleware(makeAccessControlMiddleware('admin')), adaptRoute(makeAddProductController()))
  router.get('/product', adaptRoute(makeLoadAllProductsController()))
  router.get('/product/:productId', adaptRoute(makeLoadProductByIdController()))
}
