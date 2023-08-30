import type { IdValidator, Validation } from '@/presentation/contracts'
import { InvalidIdError, MissingParamError } from '@/presentation/errors'
import { right, type Either, left } from '@/shared/either'

export class IdTypeValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly idValidator: IdValidator
  ) {}

  validate (input: any): Either<Error, null> {
    if (!input[this.fieldName]) {
      return left(new MissingParamError(this.fieldName))
    }
    const isValid = this.idValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return left(new InvalidIdError(input[this.fieldName]))
    }
    return right(null)
  }
}
