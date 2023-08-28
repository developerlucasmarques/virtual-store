import { Product, type ProductData } from '@/domain/entities/product'
import type { AddProduct, AddProductResponse } from '@/domain/usecases-contracts/product/add-product'
import { right } from '@/shared/either'

export class AddProductUseCase implements AddProduct {
  async perform (data: ProductData): Promise<AddProductResponse> {
    Product.create(data)
    return right(null)
  }
}
