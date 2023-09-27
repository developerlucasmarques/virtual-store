import type { OrderModel } from '@/domain/models'
import type { AddOrder, AddOrderData, GenerateOrderCode } from '@/domain/usecases-contracts'
import type { AddOrderRepo, IdBuilder } from '@/interactions/contracts'

export class AddOrderUseCase implements AddOrder {
  constructor (
    private readonly idBuilder: IdBuilder,
    private readonly generateOrderCode: GenerateOrderCode,
    private readonly addOrderRepo: AddOrderRepo
  ) {}

  async perform (data: AddOrderData): Promise<OrderModel> {
    const { products, userId, paymentStatus, status } = data
    const { id } = this.idBuilder.build()
    const createdAt = new Date(); const updatedAt = createdAt
    const { code: orderCode } = await this.generateOrderCode.perform(data.userId)
    const order = { id, userId, orderCode, products, createdAt, updatedAt, paymentStatus, status }
    await this.addOrderRepo.add(order)
    return order
  }
}
