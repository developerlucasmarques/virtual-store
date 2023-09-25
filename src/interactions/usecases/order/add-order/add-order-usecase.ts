import type { PaymentStatusOfOrderModel, StatusOfOrderModel } from '@/domain/models'
import type { AddOrder, AddOrderData, GenerateOrderCode } from '@/domain/usecases-contracts'
import type { AddOrderRepo, IdBuilder } from '@/interactions/contracts'
import { right, type Either } from '@/shared/either'

export class AddOrderUseCase implements AddOrder {
  reqProps: Array<keyof AddOrderData> = ['orderCode', 'userId', 'products']
  constructor (
    private readonly idBuilder: IdBuilder,
    private readonly status: StatusOfOrderModel,
    private readonly paymentStatus: PaymentStatusOfOrderModel,
    private readonly generateOrderCode: GenerateOrderCode,
    private readonly addOrderRepo: AddOrderRepo
  ) {}

  async perform (data: AddOrderData): Promise<Either<Error, null>> {
    const { products, userId } = data
    const { id } = this.idBuilder.build()
    const createdAt = new Date(); const updatedAt = createdAt
    const paymentStatus = this.paymentStatus
    const status = this.status
    const { code: orderCode } = await this.generateOrderCode.perform(data.userId)
    await this.addOrderRepo.add(
      { id, userId, orderCode, products, createdAt, updatedAt, paymentStatus, status }
    )
    return right(null)
  }
}
