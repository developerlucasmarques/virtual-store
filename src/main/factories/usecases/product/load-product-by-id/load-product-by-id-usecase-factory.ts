import type { LoadProductById } from '@/domain/usecases-contracts'
import { ProductMongoRepo } from '@/external/db/mongo-db/product/product-mongo-repo'
import { LoadProductByIdUseCase } from '@/interactions/usecases/product'

export const makeLoadProductByIdUseCase = (): LoadProductById => {
  const productMongoRepo = new ProductMongoRepo()
  return new LoadProductByIdUseCase(productMongoRepo)
}
