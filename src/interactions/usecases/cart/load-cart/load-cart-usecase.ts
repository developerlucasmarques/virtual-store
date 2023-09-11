import type { CompleteCartModel, ProductCartData } from '@/domain/models'
import type { LoadCart, LoadCartResponse } from '@/domain/usecases-contracts'
import { EmptyCartError, ProductNotAvailableError } from '@/domain/usecases-contracts/errors'
import type { LoadCartByUserIdRepo, LoadProductsByIdsRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class LoadCartUseCase implements LoadCart {
  constructor (
    private readonly loadCartByUserIdRepo: LoadCartByUserIdRepo,
    private readonly loadProductsByIdsRepo: LoadProductsByIdsRepo
  ) {}

  async perform (userId: string): Promise<LoadCartResponse> {
    const cart = await this.loadCartByUserIdRepo.loadByUserId(userId)
    if (!cart || cart.products.length === 0) {
      return left(new EmptyCartError())
    }
    const productIds = cart.products.map((product) => (product.id))
    const products = await this.loadProductsByIdsRepo.loadProductsByIds(productIds)
    for (const productId of productIds) {
      const product = products.find((product) => (product.id === productId))
      if (!product) {
        return left(new ProductNotAvailableError(productId))
      }
    }
    const cartProducts: ProductCartData[] = []
    for (const product of products) {
      cartProducts.push({
        id: product.id,
        name: product.name,
        amount: product.amount,
        quantity: 0
      })
    }
    for (let i = 0; i < cartProducts.length; i++) {
      for (const product of cart.products) {
        if (product.id === cartProducts[i].id) {
          cartProducts[i].quantity = product.quantity
        }
      }
    }
    const cartWithTotal: CompleteCartModel = {
      total: 0,
      products: cartProducts
    }
    for (const product of cartWithTotal.products) {
      cartWithTotal.total += product.quantity * product.amount
    }
    return right(cartWithTotal)
  }
}
