import type { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddProductController } from '../factories/controllers/product/add-product-factory'

export default async (router: Router): Promise<void> => {
  router.post('/product', adaptRoute(makeAddProductController()))
}
