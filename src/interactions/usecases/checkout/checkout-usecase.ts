import type { PurchaseIntentModel, UserModel } from '@/domain/models'
import type { Checkout, CheckoutResponse, CreateOrderCode, LoadCart } from '@/domain/usecases-contracts'
import { CheckoutFailureError } from '@/domain/usecases-contracts/errors'
import type { AddPurchaseIntentRepo, CheckoutGateway, IdBuilder, LoadUserByIdRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class CheckoutUseCase implements Checkout {
  constructor (
    private readonly loadCart: LoadCart,
    private readonly loadUserByIdRepo: LoadUserByIdRepo,
    private readonly checkoutGateway: CheckoutGateway,
    private readonly createOrderCode: CreateOrderCode,
    private readonly idBuilder: IdBuilder,
    private readonly addPurchaseIntentRepo: AddPurchaseIntentRepo
  ) {}

  async perform (userId: string): Promise<CheckoutResponse> {
    const loadCartResult = await this.loadCart.perform(userId)
    if (loadCartResult.isLeft()) {
      return left(loadCartResult.value)
    }
    const user = await this.loadUserByIdRepo.loadById(userId) as UserModel
    const { code: orderCode } = await this.createOrderCode.perform(userId)
    const { id: purchaseIntentId } = this.idBuilder.build()
    const addPurchaseIntentRepoData: PurchaseIntentModel = {
      id: purchaseIntentId,
      userId,
      orderCode,
      createdAt: new Date(),
      updateDat: new Date(),
      products: loadCartResult.value.products.map(
        ({ id, name, amount, quantity }) => ({ id, name, amount, quantity })
      )
    }
    await this.addPurchaseIntentRepo.add(addPurchaseIntentRepoData)
    const checkoutResult = await this.checkoutGateway.payment({
      ...loadCartResult.value,
      userEmail: user.email,
      userId,
      purchaseIntentId
    })
    if (!checkoutResult) {
      return left(new CheckoutFailureError())
    }
    return right({ url: checkoutResult.url })
  }
}
