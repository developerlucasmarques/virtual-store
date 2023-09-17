import type { AddOrder, AddOrderData, AddOrderResponse } from '@/domain/usecases-contracts'
import type { LoadPurchaseIntentByIdRepo } from '@/interactions/contracts'
import { right } from '@/shared/either'

export class AddOrderUseCase implements AddOrder {
  constructor (private readonly loadPurchaseIntentByIdRepo: LoadPurchaseIntentByIdRepo) {}

  async perform (data: AddOrderData): Promise<AddOrderResponse> {
    await this.loadPurchaseIntentByIdRepo.loadById(data.purchaseIntentId)
    return right(null)
  }
}
