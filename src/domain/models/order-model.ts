export type ProductOfOrderModel = {
  id: string
  name: string
  amount: number
  quantity: number
}

export type PaymentStatusOfOrderModel = 'Payment_Not_Started' | 'Payment_Pending' | 'Payment_Confirmed' | 'Payment_Declined'

export type StatusOfOrderModel = 'Incomplete' | 'Processing' | 'Completed' | 'Cancelled'

export type OrderModel = {
  id: string
  userId: string
  orderCode: string
  status: StatusOfOrderModel
  paymentStatus: PaymentStatusOfOrderModel
  createdAt: Date
  updatedAt: Date
  products: ProductOfOrderModel[]
}
