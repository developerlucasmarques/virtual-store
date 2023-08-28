import { Product, type ProductData } from '@/domain/entities/product'
import type { AddProduct, AddProductResponse } from '@/domain/usecases-contracts'
import type { IdBuilder } from '@/interactions/contracts'
import { left, right } from '@/shared/either'

export class AddProductUseCase implements AddProduct {
  constructor (private readonly idBuilder: IdBuilder) {}

  async perform (data: ProductData): Promise<AddProductResponse> {
    const product = Product.create(data)
    if (product.isLeft()) {
      return left(product.value)
    }
    this.idBuilder.build()
    return right(null)
  }
}
