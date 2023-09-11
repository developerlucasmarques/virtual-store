export type ProductCartData = {
  id: string
  name: string
  amount: number
  quantity: number
}

export type CartWithTotalModel = {
  id: string
  userId: string
  total: number
  products: ProductCartData[]
}
