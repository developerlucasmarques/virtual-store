import { Product, type ProductData } from '@/domain/entities/product'
import type { AddProduct, AddProductResponse } from '@/domain/usecases-contracts'
import type { AddProductRepo, IdBuilder } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class AddProductUseCase implements AddProduct {
  constructor (
    private readonly idBuilder: IdBuilder,
    private readonly addProductRepo: AddProductRepo
  ) {}

  async perform (data: ProductData): Promise<AddProductResponse> {
    const product = Product.create(data)
    if (product.isLeft()) {
      return left(product.value)
    }
    const { name, amount, description } = data
    const { id } = this.idBuilder.build()
    await this.addProductRepo.add({ id, name, amount, description })
    return right(null)
  }
}
