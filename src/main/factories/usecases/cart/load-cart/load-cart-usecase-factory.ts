import { Cart } from '@/domain/entities/cart'
import type { LoadCart } from '@/domain/usecases-contracts'
import { CartMongoRepo } from '@/external/db/mongo-db/cart/cart-mongo-repo'
import { ProductMongoRepo } from '@/external/db/mongo-db/product/product-mongo-repo'
import { LoadCartUseCase } from '@/interactions/usecases/cart/load-cart/load-cart-usecase'

export const makeLoadCartUseCase = (): LoadCart => {
  const cartMongoRepo = new CartMongoRepo()
  const productMongoRepo = new ProductMongoRepo()
  const cart = new Cart()
  return new LoadCartUseCase(cartMongoRepo, productMongoRepo, cart)
}
