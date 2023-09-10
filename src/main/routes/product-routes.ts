import { adaptMiddleware, adaptRoute } from '@/main/adapters'
import { makeAddProductController, makeLoadAllProductsController, makeLoadProductByIdController } from '@/main/factories/controllers/product'
import type { Router } from 'express'
import { makeAdminMiddleware } from '../middlewares'

export default async (router: Router): Promise<void> => {
  router.post('/product', adaptMiddleware(makeAdminMiddleware()), adaptRoute(makeAddProductController()))
  router.get('/product', adaptRoute(makeLoadAllProductsController()))
  router.get('/product/:productId', adaptRoute(makeLoadProductByIdController()))
}
