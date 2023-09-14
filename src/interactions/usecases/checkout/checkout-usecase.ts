import type { Checkout, CheckoutResponse, LoadCart } from '@/domain/usecases-contracts'
import { CheckoutFailureError } from '@/domain/usecases-contracts/errors'
import type { CheckoutGateway, LoadUserByIdRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class CheckoutUseCase implements Checkout {
  constructor (
    private readonly loadCart: LoadCart,
    private readonly loadUserByIdRepo: LoadUserByIdRepo,
    private readonly checkoutGateway: CheckoutGateway
  ) {}

  async perform (userId: string): Promise<CheckoutResponse> {
    const loadCartResult = await this.loadCart.perform(userId)
    if (loadCartResult.isLeft()) {
      return left(loadCartResult.value)
    }
    await this.loadUserByIdRepo.loadById(userId)
    const checkoutResult = await this.checkoutGateway.payment(loadCartResult.value)
    if (!checkoutResult) {
      return left(new CheckoutFailureError())
    }
    return right(checkoutResult)
  }
}
