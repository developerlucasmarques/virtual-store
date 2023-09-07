import type { AddProductToCart, AddProductToCartData, AddProductToCartResponse } from '@/domain/usecases-contracts'
import { InvalidProductQuantityError, ProductNotFoundError } from '@/domain/usecases-contracts/errors'
import type { AddProductToCartRepo, CreateCartRepo, IdBuilder, LoadCartByUserIdRepo, LoadProductByIdRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class AddProductToCartUseCase implements AddProductToCart {
  constructor (
    private readonly loadProductByIdRepo: LoadProductByIdRepo,
    private readonly loadCartByUserIdRepo: LoadCartByUserIdRepo,
    private readonly idBuilder: IdBuilder,
    private readonly createCartRepo: CreateCartRepo,
    private readonly addProductToCartRepo: AddProductToCartRepo
  ) {}

  async perform (data: AddProductToCartData): Promise<AddProductToCartResponse> {
    const { productId, userId } = data
    if (data.productQty < 1) {
      return left(new InvalidProductQuantityError())
    }
    const product = await this.loadProductByIdRepo.loadById(productId)
    if (!product) {
      return left(new ProductNotFoundError(productId))
    }
    const cart = await this.loadCartByUserIdRepo.loadByUserId(userId)
    if (!cart) {
      const { id } = this.idBuilder.build()
      await this.createCartRepo.create({
        id, userId, product: { id: productId, quantity: data.productQty }
      })
      return right(null)
    }
    let quantity = data.productQty
    for (const product of cart.products) {
      if (productId === product.id) {
        quantity += product.quantity
      }
    }
    await this.addProductToCartRepo.addProduct({
      id: cart?.id, product: { id: productId, quantity }
    })
    return right(null)
  }
}
