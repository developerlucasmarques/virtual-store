import type { AddProductToCart } from '@/domain/usecases-contracts'
import { CartMongoRepo } from '@/external/db/mongo-db/cart/cart-mongo-repo'
import { IdMongo } from '@/external/db/mongo-db/id/id-mongo'
import { AddProductToCartUseCase } from '@/interactions/usecases/cart'
import { makeLoadProductByIdUseCase } from '../../product'

export const makeAddProductToCartUseCase = (): AddProductToCart => {
  const idMongoBuilder = new IdMongo()
  const cartMongoRepo = new CartMongoRepo()
  return new AddProductToCartUseCase(
    makeLoadProductByIdUseCase(),
    cartMongoRepo,
    idMongoBuilder,
    cartMongoRepo,
    cartMongoRepo,
    cartMongoRepo
  )
}
