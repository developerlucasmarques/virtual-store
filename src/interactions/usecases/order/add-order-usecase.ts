import type { AddOrder, AddOrderData, AddOrderResponse } from '@/domain/usecases-contracts'
import { PurchaseIntentNotFoundError } from '@/domain/usecases-contracts/errors'
import type { AddOrderRepo, IdBuilder, LoadPurchaseIntentByIdRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class AddOrderUseCase implements AddOrder {
  reqProps: Array<keyof AddOrderData> = ['purchaseIntentId', 'userId']
  constructor (
    private readonly loadPurchaseIntentByIdRepo: LoadPurchaseIntentByIdRepo,
    private readonly idBuilder: IdBuilder,
    private readonly addOrderRepo: AddOrderRepo
  ) {}

  async perform (data: AddOrderData): Promise<AddOrderResponse> {
    const purchaseIntent = await this.loadPurchaseIntentByIdRepo.loadById(data.purchaseIntentId)
    if (!purchaseIntent) {
      return left(new PurchaseIntentNotFoundError('any_purchase_intent_id'))
    }
    const { id } = this.idBuilder.build()
    await this.addOrderRepo.add({ id, userId: data.userId, products: purchaseIntent.products })
    return right(null)
  }
}
