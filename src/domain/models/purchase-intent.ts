export type ProductOfPurchaseIntentModel = {
  id: string
  name: string
  amount: number
  quantity: number
}

export type StatusOfPurchaseIntentModel = 'completed' | 'declined' | 'pending'

export type PurchaseIntentModel = {
  id: string
  userId: string
  gatewayCustomerId: string
  createdAt: Date
  updateDat: Date
  status: StatusOfPurchaseIntentModel
  products: ProductOfPurchaseIntentModel[]
}
