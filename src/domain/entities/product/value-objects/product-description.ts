import { type Either, left, right } from '@/shared/either'
import { InvalidProductDescriptionError } from '../errors'

export class ProductDescription {
  private constructor (private readonly description: string) {
    Object.freeze(this)
  }

  static create (description: string): Either<InvalidProductDescriptionError, ProductDescription> {
    if (!ProductDescription.validade(description)) {
      return left(new InvalidProductDescriptionError(description))
    }
    description = description.trim()
    description = description.replace(/\s+/g, ' ')
    return right(new ProductDescription(description))
  }

  private static validade (description: string): boolean {
    if (description.length < 10 || description.length > 500) {
      return false
    }
    return true
  }
}
