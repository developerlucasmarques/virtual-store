export type ProductCartData = {
  id: string
  name: string
  amount: number
  quantity: number
}

export type CartWithTotalModel = {
  total: number
  products: ProductCartData[]
}
