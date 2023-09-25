import type { PaymentStatusOfOrderModel } from '@/domain/models'
import type { AddOrder } from '@/domain/usecases-contracts'
import { IdMongo } from '@/external/db/mongo-db/id/id-mongo'
import { OrderMongoRepo } from '@/external/db/mongo-db/order/order-mongo-repo'
import { AddOrderUseCase } from '@/interactions/usecases/order'

export const makeAddOrderUseCase = (paymentStatus: PaymentStatusOfOrderModel): AddOrder => {
  const idMongoBuilder = new IdMongo()
  const orderMongoRepo = new OrderMongoRepo()
  return new AddOrderUseCase(idMongoBuilder, paymentStatus, orderMongoRepo)
}
