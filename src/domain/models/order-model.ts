export type ProductOfOrderModel = {
  id: string
  name: string
  amount: number
  quantity: number
}

export type StatusOfOrderModel = 'Payment_Pending' | 'Payment_Confirmed' | 'Payment_Declined'

export type OrderModel = {
  id: string
  userId: string
  orderCode: string
  status: StatusOfOrderModel
  createdAt: Date
  updatedAt: Date
  products: ProductOfOrderModel[]
}
