import type { AddOrder } from '@/domain/usecases-contracts'
import { IdMongo } from '@/external/db/mongo-db/id/id-mongo'
import { OrderMongoRepo } from '@/external/db/mongo-db/order/order-mongo-repo'
import { AddOrderUseCase } from '@/interactions/usecases/order'
import { makeGenerateOrderCodeUseCase } from '../'

export const makeAddOrderUseCase = (): AddOrder => {
  const idMongoBuilder = new IdMongo()
  const orderMongoRepo = new OrderMongoRepo()
  return new AddOrderUseCase(
    idMongoBuilder, makeGenerateOrderCodeUseCase(), orderMongoRepo
  )
}
