import type { AddOrder } from '@/domain/usecases-contracts'
import { IdMongo } from '@/external/db/mongo-db/id/id-mongo'
import { OrderMongoRepo } from '@/external/db/mongo-db/order/order-mongo-repo'
import { PurchaseIntentMongoRepo } from '@/external/db/mongo-db/purchase-intent/purchase-intent-mongo-repo'
import { AddOrderUseCase } from '@/interactions/usecases/order/add-order-usecase'

export const makeAddOrderUseCase = (): AddOrder => {
  const idMongoBuilder = new IdMongo()
  const purchaseIntentMongoRepo = new PurchaseIntentMongoRepo()
  const orderMongoRepo = new OrderMongoRepo()
  return new AddOrderUseCase(purchaseIntentMongoRepo, idMongoBuilder, orderMongoRepo)
}
