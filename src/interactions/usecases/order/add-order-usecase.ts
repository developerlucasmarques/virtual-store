import type { AddOrder, AddOrderData, AddOrderResponse } from '@/domain/usecases-contracts'
import { PurchaseIntentNotFoundError } from '@/domain/usecases-contracts/errors'
import type { IdBuilder, LoadPurchaseIntentByIdRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class AddOrderUseCase implements AddOrder {
  constructor (
    private readonly loadPurchaseIntentByIdRepo: LoadPurchaseIntentByIdRepo,
    private readonly idBuilder: IdBuilder
  ) {}

  async perform (data: AddOrderData): Promise<AddOrderResponse> {
    const purchaseIntent = await this.loadPurchaseIntentByIdRepo.loadById(data.purchaseIntentId)
    if (!purchaseIntent) {
      return left(new PurchaseIntentNotFoundError('any_purchase_intent_id'))
    }
    this.idBuilder.build()
    return right(null)
  }
}
