import type { Validation } from '@/presentation/contracts'
import { InvalidParamsError } from '@/presentation/errors/invalid-params-error'
import { right, type Either, left } from '@/shared/either'

export class RequiredParamValidation implements Validation {
  constructor (private readonly paramName: string) {}

  validate (input: any): Either<Error, null> {
    if (!input[this.paramName]) {
      return left(new InvalidParamsError(this.paramName))
    }
    return right(null)
  }
}
