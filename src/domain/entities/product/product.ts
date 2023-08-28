import { right, left } from '@/shared/either'
import { ProductAmount, ProductDescription, ProductName } from './value-objects'
import type { CreateProductResponse, ProductData } from '.'

export class Product {
  private constructor (
    private readonly name: ProductName,
    private readonly amount: ProductAmount,
    private readonly description: ProductDescription,
    private readonly image: any
  ) {}

  static create (data: ProductData): CreateProductResponse {
    const name = ProductName.create(data.name)
    if (name.isLeft()) {
      return left(name.value)
    }
    const amount = ProductAmount.create(data.amount)
    if (amount.isLeft()) {
      return left(amount.value)
    }
    const description = ProductDescription.create(data.description)
    if (description.isLeft()) {
      return left(description.value)
    }
    return right(
      new Product(name.value, amount.value, description.value, data.image)
    )
  }
}
