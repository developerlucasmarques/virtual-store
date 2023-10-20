import type { PaymentStatusOfOrderModel, StatusOfOrderModel } from '@/domain/models'
import type { UpdateOrder, UpdateOrderData } from '@/domain/usecases-contracts'
import type { UpdateOrderRepo } from '@/interactions/contracts'

export class UpdateOrderUseCase implements UpdateOrder {
  requiredProps: Array<keyof UpdateOrderData> = ['orderId']

  constructor (
    private readonly updateOrderRepo: UpdateOrderRepo,
    private readonly status?: StatusOfOrderModel,
    private readonly paymentStatus?: PaymentStatusOfOrderModel
  ) {}

  async perform (data: UpdateOrderData): Promise<void> {
    if (!this.paymentStatus && !this.status) return
    const { orderId: id } = data
    await this.updateOrderRepo.updateById({
      id, status: this.status, paymentStatus: this.paymentStatus, updatedAt: new Date()
    })
  }
}
