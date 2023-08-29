import type { AddProduct } from '@/domain/usecases-contracts'
import { IdMongoBuilder } from '@/external/db/mongo-db/id/id-mongo-builder'
import { ProductMongoRepo } from '@/external/db/mongo-db/product/product-mongo-repo'
import { AddProductUseCase } from '@/interactions/usecases/product'

export const makeAddProductUseCase = (): AddProduct => {
  const idMongoBuilder = new IdMongoBuilder()
  const productMongoRepo = new ProductMongoRepo()
  return new AddProductUseCase(idMongoBuilder, productMongoRepo)
}
