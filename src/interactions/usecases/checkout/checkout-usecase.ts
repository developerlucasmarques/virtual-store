import type { UserModel } from '@/domain/models'
import type { AddOrder, Checkout, CheckoutResponse, LoadCart } from '@/domain/usecases-contracts'
import { CheckoutFailureError } from '@/domain/usecases-contracts/errors'
import type { CheckoutGateway, LoadUserByIdRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class CheckoutUseCase implements Checkout {
  constructor (
    private readonly loadCart: LoadCart,
    private readonly loadUserByIdRepo: LoadUserByIdRepo,
    private readonly addOrder: AddOrder,
    private readonly checkoutGateway: CheckoutGateway
  ) {}

  async perform (userId: string): Promise<CheckoutResponse> {
    const loadCartResult = await this.loadCart.perform(userId)
    if (loadCartResult.isLeft()) {
      return left(loadCartResult.value)
    }
    const { email: userEmail } = await this.loadUserByIdRepo.loadById(userId) as UserModel
    const { id: orderId } = await this.addOrder.perform({
      userId, products: loadCartResult.value.products
    })
    const checkoutResult = await this.checkoutGateway.payment({
      ...loadCartResult.value, userEmail, userId, orderId
    })
    if (!checkoutResult) {
      return left(new CheckoutFailureError())
    }
    return right({ url: checkoutResult.url })
  }
}
