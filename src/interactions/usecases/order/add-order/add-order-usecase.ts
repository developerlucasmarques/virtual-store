import type { OrderModel, PaymentStatusOfOrderModel, StatusOfOrderModel } from '@/domain/models'
import type { AddOrder, AddOrderData, GenerateOrderCode } from '@/domain/usecases-contracts'
import type { AddOrderRepo, IdBuilder } from '@/interactions/contracts'

export class AddOrderUseCase implements AddOrder {
  constructor (
    private readonly idBuilder: IdBuilder,
    private readonly status: StatusOfOrderModel,
    private readonly paymentStatus: PaymentStatusOfOrderModel,
    private readonly generateOrderCode: GenerateOrderCode,
    private readonly addOrderRepo: AddOrderRepo
  ) {}

  async perform (data: AddOrderData): Promise<OrderModel> {
    const { products, userId } = data
    const { id } = this.idBuilder.build()
    const createdAt = new Date(); const updatedAt = createdAt
    const paymentStatus = this.paymentStatus
    const status = this.status
    const { code: orderCode } = await this.generateOrderCode.perform(data.userId)
    const order = { id, userId, orderCode, products, createdAt, updatedAt, paymentStatus, status }
    await this.addOrderRepo.add(order)
    return order
  }
}
