import { right, type Either, left } from '@/shared/either'
import { ProductAmount, ProductDescription, ProductName } from './value-objects'
import type { InvalidProductAmountError, InvalidProductNameError } from './errors'

export type ProductData = {
  name: string
  amount: number
  description: string
}

export type CreateProductResponse = Either<InvalidProductNameError | InvalidProductAmountError, Product>

export class Product {
  private constructor (private readonly name: ProductName) {}

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
    return right(new Product(name.value))
  }
}
