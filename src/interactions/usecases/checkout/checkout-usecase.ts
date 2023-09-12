import type { Checkout, CheckoutResponse, LoadCart } from '@/domain/usecases-contracts'
import { right } from '@/shared/either'

export class CheckoutUseCase implements Checkout {
  constructor (private readonly loadCart: LoadCart) {}

  async perform (userId: string): Promise<CheckoutResponse> {
    await this.loadCart.perform(userId)
    return right({
      sessionUrl: ''
    })
  }
}
