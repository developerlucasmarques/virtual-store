import type { Checkout, CheckoutResponse, LoadCart } from '@/domain/usecases-contracts'
import type { CheckoutGateway } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class CheckoutUseCase implements Checkout {
  constructor (
    private readonly loadCart: LoadCart,
    private readonly checkoutGateway: CheckoutGateway
  ) {}

  async perform (userId: string): Promise<CheckoutResponse> {
    const loadCartResult = await this.loadCart.perform(userId)
    if (loadCartResult.isLeft()) {
      return left(loadCartResult.value)
    }
    await this.checkoutGateway.payment(loadCartResult.value)
    return right({
      value: ''
    })
  }
}
