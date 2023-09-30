import type { PaymentStatusOfOrderModel, StatusOfOrderModel } from '@/domain/models'
import type { UpdateOrder } from '@/domain/usecases-contracts'
import { OrderMongoRepo } from '@/external/db/mongo-db/order/order-mongo-repo'
import { UpdateOrderUseCase } from '@/interactions/usecases/order'

export type UpdateOrderUseCaseFactoryData = {
  status?: StatusOfOrderModel
  paymentStatus?: PaymentStatusOfOrderModel
}

export const makeUpdateOrderUseCase = (data: UpdateOrderUseCaseFactoryData): UpdateOrder => {
  const orderMongoRepo = new OrderMongoRepo()
  return new UpdateOrderUseCase(orderMongoRepo, data.status, data.paymentStatus)
}
