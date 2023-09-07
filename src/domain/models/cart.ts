export type ProductCart = {
  id: string
  quantity: number
}

export type CartModel = {
  id: string
  userId: string
  products: ProductCart[]
}
