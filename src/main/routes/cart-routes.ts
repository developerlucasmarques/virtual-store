import type { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddProductToCartController } from '../factories/controllers/cart/add-product-to-cart/add-product-to-cart-factory'
import { makeAccessControlMiddleware } from '../factories/middleware/access-control-middleware-factory'

export default async (router: Router): Promise<void> => {
  router.post('/cart', adaptMiddleware(makeAccessControlMiddleware('customer')), adaptRoute(makeAddProductToCartController()))
}
