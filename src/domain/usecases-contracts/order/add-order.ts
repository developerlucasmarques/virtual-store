import type { OrderModel, PaymentStatusOfOrderModel, ProductOfOrderModel, StatusOfOrderModel } from '@/domain/models'

export type AddOrderData = {
  userId: string
  status: StatusOfOrderModel
  paymentStatus: PaymentStatusOfOrderModel
  products: ProductOfOrderModel[]
}

export interface AddOrder {
  perform: (data: AddOrderData) => Promise<OrderModel>
}
