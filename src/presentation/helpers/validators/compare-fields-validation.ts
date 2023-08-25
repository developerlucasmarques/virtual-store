import { type Either, left, right } from '@/shared/either'
import type { Validation } from '@/presentation/contracts'
import { InvalidParamError } from '@/presentation/errors'

export class CompareFieldsValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldToCompareName: string
  ) {}

  validate (input: any): Either<Error, null> {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return left(new InvalidParamError(this.fieldToCompareName))
    }
    return right(null)
  }
}
