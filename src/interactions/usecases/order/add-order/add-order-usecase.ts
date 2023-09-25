import type { PaymentStatusOfOrderModel } from '@/domain/models'
import type { AddOrder, AddOrderData } from '@/domain/usecases-contracts'
import type { AddOrderRepo, IdBuilder } from '@/interactions/contracts'
import { right, type Either } from '@/shared/either'

export class AddOrderUseCase implements AddOrder {
  reqProps: Array<keyof AddOrderData> = ['orderCode', 'userId', 'products']
  constructor (
    private readonly idBuilder: IdBuilder,
    private readonly paymentStatus: PaymentStatusOfOrderModel,
    private readonly addOrderRepo: AddOrderRepo
  ) {}

  async perform (data: AddOrderData): Promise<Either<Error, null>> {
    const { orderCode, products, userId } = data
    const { id } = this.idBuilder.build()
    const createdAt = new Date(); const updatedAt = createdAt
    const paymentStatus = this.paymentStatus
    const status = 'Processing'
    await this.addOrderRepo.add(
      { id, userId, orderCode, products, createdAt, updatedAt, paymentStatus, status }
    )
    return right(null)
  }
}
