import type { AddProductToCart, AddProductToCartData, AddProductToCartResponse, LoadProductById } from '@/domain/usecases-contracts'
import { InvalidProductQuantityError } from '@/domain/usecases-contracts/errors'
import type { AddProductToCartRepo, CreateCartRepo, IdBuilder, LoadCartByUserIdRepo, UpdateProductQtyCartRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class AddProductToCartUseCase implements AddProductToCart {
  constructor (
    private readonly loadProductById: LoadProductById,
    private readonly loadCartByUserIdRepo: LoadCartByUserIdRepo,
    private readonly idBuilder: IdBuilder,
    private readonly createCartRepo: CreateCartRepo,
    private readonly updateProductQtyCartRepo: UpdateProductQtyCartRepo,
    private readonly addProductToCartRepo: AddProductToCartRepo
  ) {}

  async perform (data: AddProductToCartData): Promise<AddProductToCartResponse> {
    const { productId, userId, productQty } = data
    if (productQty < 1) {
      return left(new InvalidProductQuantityError())
    }
    const productResult = await this.loadProductById.perform(productId)
    if (productResult.isLeft()) {
      return left(productResult.value)
    }
    const cart = await this.loadCartByUserIdRepo.loadByUserId(userId)
    if (!cart) {
      const { id } = this.idBuilder.build()
      await this.createCartRepo.create({
        id, userId, product: { id: productId, quantity: productQty }
      })
      return right(null)
    }
    let quantity = productQty
    for (const product of cart.products) {
      if (productId === product.id) {
        quantity += product.quantity
        await this.updateProductQtyCartRepo.updateProductQty({
          id: cart.id, product: { id: productId, quantity }
        })
        return right(null)
      }
    }
    await this.addProductToCartRepo.addProduct({
      id: cart.id, product: { id: productId, quantity }
    })
    return right(null)
  }
}
