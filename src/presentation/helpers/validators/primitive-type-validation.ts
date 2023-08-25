import { ValidationTypeError } from '@/presentation/errors'
import type { Validation } from '@/presentation/contracts'
import { type Either, left, right } from '@/shared/either'

export class PrimitiveTypeValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldType: 'string' | 'number' | 'boolean' | 'array') {
  }

  validate (input: any): Either<Error, null> {
    const fieldValue = input[this.fieldName]
    if (this.fieldType === 'array') {
      if (fieldValue instanceof Array) {
        return right(null)
      } else {
        return left(new ValidationTypeError(this.fieldName))
      }
    }
    if (typeof fieldValue === this.fieldType) {
      return right(null)
    }
    return left(new ValidationTypeError(this.fieldName))
  }
}
