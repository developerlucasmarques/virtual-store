import type { PaymentStatusOfOrderModel, StatusOfOrderModel } from '@/domain/models'

export type UpdateOrderRepoData = {
  id: string
  status?: StatusOfOrderModel
  paymentStatus?: PaymentStatusOfOrderModel
  updatedAt: Date
}

export interface UpdateOrderRepo {
  updateById: (data: UpdateOrderRepoData) => Promise<void>
}
