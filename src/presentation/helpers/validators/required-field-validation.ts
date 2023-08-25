import { left, type Either, right } from '@/shared/either'
import type { Validation } from '@/presentation/contracts'
import { MissingParamError } from '@/presentation/errors'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: any): Either<Error, null> {
    if (!input[this.fieldName]) {
      return left(new MissingParamError(this.fieldName))
    }
    return right(null)
  }
}
