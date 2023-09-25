export type ProductOfPurchaseIntentModel = {
  id: string
  name: string
  amount: number
  quantity: number
}

export type PurchaseIntentModel = {
  id: string
  userId: string
  createdAt: Date
  updatedAt: Date
  products: ProductOfPurchaseIntentModel[]
}
