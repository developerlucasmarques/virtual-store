import { type Either, left, right } from '@/shared/either'
import { InvalidProductNameError } from '../errors'

export class ProductName {
  private constructor (private readonly name: string) {
    Object.freeze(this)
  }

  static create (name: string): Either<InvalidProductNameError, ProductName> {
    if (!ProductName.validade(name)) {
      return left(new InvalidProductNameError(name))
    }
    name = name.trim()
    name = name.replace(/\s+/g, ' ')
    return right(new ProductName(name))
  }

  private static validade (name: string): boolean {
    if (name.length < 3 || name.length > 50) {
      return false
    }
    return true
  }
}
