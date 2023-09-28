import { type PaymentStatusOfOrderModel, type StatusOfOrderModel } from '@/domain/models'
import type { UpdateOrder, UpdateOrderData, UpdateOrderResponse } from '@/domain/usecases-contracts'
import { MissingStatusError } from '@/domain/usecases-contracts/errors'
import { left, right } from '@/shared/either'

export class UpdateOrderUseCase implements UpdateOrder {
  requiredProps: Array<keyof UpdateOrderData> = ['orderId']

  constructor (
    private readonly status?: StatusOfOrderModel,
    private readonly paymentStatus?: PaymentStatusOfOrderModel
  ) {}

  async perform (data: UpdateOrderData): Promise<UpdateOrderResponse> {
    if (!this.paymentStatus && !this.status) {
      return left(new MissingStatusError())
    }
    return right(null)
  }
}
