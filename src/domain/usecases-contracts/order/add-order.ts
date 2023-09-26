import type { OrderModel, ProductOfOrderModel } from '@/domain/models'

export type AddOrderData = {
  userId: string
  products: ProductOfOrderModel[]
}

export interface AddOrder {
  perform: (data: AddOrderData) => Promise<OrderModel>
}
