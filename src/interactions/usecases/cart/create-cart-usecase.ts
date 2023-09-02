import type { AddProductToCartData, CreateCart, CreateCartReponse } from '@/domain/usecases-contracts'
import { ProductNotFoundError } from '@/domain/usecases-contracts/errors'
import type { CreateCartRepo, IdBuilder, LoadProductByIdRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class CreateCartUseCase implements CreateCart {
  constructor (
    private readonly loadProductByIdRepo: LoadProductByIdRepo,
    private readonly idBuilder: IdBuilder,
    private readonly createCartRepo: CreateCartRepo
  ) {}

  async perform (data: AddProductToCartData): Promise<CreateCartReponse> {
    const product = await this.loadProductByIdRepo.loadById(data.productId)
    if (!product) {
      return left(new ProductNotFoundError(data.productId))
    }
    const { id } = this.idBuilder.build()
    await this.createCartRepo.create({ id, ...data })
    return right(null)
  }
}
