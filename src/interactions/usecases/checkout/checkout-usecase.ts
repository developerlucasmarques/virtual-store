import type { PurchaseIntentModel, UserModel } from '@/domain/models'
import type { Checkout, CheckoutResponse, LoadCart } from '@/domain/usecases-contracts'
import { CheckoutFailureError } from '@/domain/usecases-contracts/errors'
import type { AddPurchaseIntentRepo, CheckoutGateway, IdBuilder, LoadUserByIdRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class CheckoutUseCase implements Checkout {
  constructor (
    private readonly loadCart: LoadCart,
    private readonly loadUserByIdRepo: LoadUserByIdRepo,
    private readonly checkoutGateway: CheckoutGateway,
    private readonly idBuilder: IdBuilder,
    private readonly addPurchaseIntentRepo: AddPurchaseIntentRepo
  ) {}

  async perform (userId: string): Promise<CheckoutResponse> {
    const loadCartResult = await this.loadCart.perform(userId)
    if (loadCartResult.isLeft()) {
      return left(loadCartResult.value)
    }
    const user = await this.loadUserByIdRepo.loadById(userId) as UserModel
    const checkoutResult = await this.checkoutGateway.payment({
      ...loadCartResult.value, userEmail: user.email, userId
    })
    if (!checkoutResult) {
      return left(new CheckoutFailureError())
    }
    const addPurchaseIntentRepoData: PurchaseIntentModel = {
      id: this.idBuilder.build().id,
      userId,
      gatewayCustomerId: checkoutResult.gatewayCustomerId,
      createdAt: new Date(),
      updateDat: new Date(),
      status: 'pending',
      products: loadCartResult.value.products.map(
        ({ id, name, amount, quantity }) => ({ id, name, amount, quantity })
      )
    }
    await this.addPurchaseIntentRepo.add(addPurchaseIntentRepoData)
    return right({ url: checkoutResult.url })
  }
}
