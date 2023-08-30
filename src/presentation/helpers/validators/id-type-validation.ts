import type { IdValidator, Validation } from '@/presentation/contracts'
import { right, type Either } from '@/shared/either'

export class IdTypeValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly idValidator: IdValidator
  ) {}

  validate (input: any): Either<Error, null> {
    this.idValidator.isValid(input[this.fieldName])

    return right(null)
  }
}
