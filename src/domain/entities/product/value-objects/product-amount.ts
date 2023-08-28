import { left, type Either, right } from '@/shared/either'
import { InvalidProductAmountError } from '../errors'

export class ProductAmount {
  private constructor (private readonly amount: number) {}

  static create (amount: number): Either<InvalidProductAmountError, ProductAmount> {
    if (!ProductAmount.validade(amount)) {
      return left(new InvalidProductAmountError(amount))
    }
    return right(new ProductAmount(amount))
  }

  private static validade (amount: number): boolean {
    if (amount < 0) return false
    return true
  }
}
