import type { PurchaseIntentModel } from '@/domain/models'

export interface AddPurchaseIntentRepo {
  add: (data: PurchaseIntentModel) => Promise<void>
}
