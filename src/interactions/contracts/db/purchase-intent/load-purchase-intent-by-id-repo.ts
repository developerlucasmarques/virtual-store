import type { PurchaseIntentModel } from '@/domain/models'

export interface LoadPurchaseIntentByIdRepo {
  loadById: (id: string) => Promise<null | PurchaseIntentModel>
}
