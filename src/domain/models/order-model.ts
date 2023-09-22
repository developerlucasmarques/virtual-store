export type ProductOfOrderModel = {
  id: string
  name: string
  amount: number
  quantity: number
}

export type OrderModel = {
  id: string
  userId: string
  orderCode: string
  createdAt: Date
  updatedAt: Date
  products: ProductOfOrderModel[]
}
