export type ProductCartData = {
  id: string
  name: string
  amount: number
  quantity: number
}

export type CompleteCartModel = {
  total: number
  products: ProductCartData[]
}
