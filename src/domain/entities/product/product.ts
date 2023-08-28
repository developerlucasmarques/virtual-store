import { right, type Either, left } from '@/shared/either'
import { ProductName } from './value-objects'
import type { InvalidNameError } from '../user/errors'

export type ProductData = {
  name: string
  amount: number
  description: string
}

export type CreateProductResponse = Either<InvalidNameError, Product>

export class Product {
  private constructor (private readonly name: ProductName) {}

  static create (data: ProductData): CreateProductResponse {
    const name = ProductName.create(data.name)
    if (name.isLeft()) {
      return left(name.value)
    }
    return right(new Product(name.value))
  }
}
