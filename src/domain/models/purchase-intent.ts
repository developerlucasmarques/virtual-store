export type ProductOfPurchaseIntentModel = {
  id: string
  name: string
  amount: number
  quantity: number
}

export type PurchaseIntentModel = {
  id: string
  userId: string
  gatewayCustomerId: string
  createdAt: Date
  updateDat: Date
  products: ProductOfPurchaseIntentModel[]
}
