import { Product, type ProductData } from '@/domain/entities/product'
import type { AddProduct, AddProductResponse } from '@/domain/usecases-contracts/product/add-product'
import { left, right } from '@/shared/either'

export class AddProductUseCase implements AddProduct {
  async perform (data: ProductData): Promise<AddProductResponse> {
    const product = Product.create(data)
    if (product.isLeft()) {
      return left(product.value)
    }
    return right(null)
  }
}
