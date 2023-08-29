import type { LoadAllProducts } from '@/domain/usecases-contracts'
import { ProductMongoRepo } from '@/external/db/mongo-db/product/product-mongo-repo'
import { LoadAllProductsUseCase } from '@/interactions/usecases/product'

export const makeLoadAllProductsUseCase = (): LoadAllProducts => {
  const productMongoRepo = new ProductMongoRepo()
  return new LoadAllProductsUseCase(productMongoRepo)
}
