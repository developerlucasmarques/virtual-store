import { type PaymentStatusOfOrderModel, type StatusOfOrderModel } from '@/domain/models'
import type { UpdateOrder, UpdateOrderData, UpdateOrderResponse } from '@/domain/usecases-contracts'
import { MissingStatusError } from '@/domain/usecases-contracts/errors'
import type { UpdateOrderRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class UpdateOrderUseCase implements UpdateOrder {
  requiredProps: Array<keyof UpdateOrderData> = ['orderId']

  constructor (
    private readonly updateOrderRepo: UpdateOrderRepo,
    private readonly status?: StatusOfOrderModel,
    private readonly paymentStatus?: PaymentStatusOfOrderModel
  ) {}

  async perform (data: UpdateOrderData): Promise<UpdateOrderResponse> {
    if (!this.paymentStatus && !this.status) {
      return left(new MissingStatusError())
    }
    const { orderId: id } = data
    const status = this.status
    const paymentStatus = this.paymentStatus
    const updatedAt = new Date()
    await this.updateOrderRepo.updateById({ id, status, paymentStatus, updatedAt })
    return right(null)
  }
}
