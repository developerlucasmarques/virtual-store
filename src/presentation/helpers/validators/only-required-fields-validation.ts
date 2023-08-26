import { UnnecessaryFieldError } from '@/presentation/errors'
import { type Either, left, right } from '@/shared/either'
import type { Validation } from '@/presentation/contracts'

export type ListWithRequiredFields = {
  listName: string
  listFields: string[]
}

export class OnlyRequiredFieldsValidation implements Validation {
  constructor (
    private readonly requiredFields: string[],
    private readonly listWithRequiredFields?: ListWithRequiredFields
  ) {}

  validate (input: any): Either<Error, null> {
    const keys = Object.keys(input)
    for (const key of keys) {
      if (!this.requiredFields.includes(key)) {
        return left(new UnnecessaryFieldError(key))
      }
    }
    if (this.listWithRequiredFields) {
      const array = input[this.listWithRequiredFields.listName]
      for (const object of array) {
        const keys = Object.keys(object)
        for (const key of keys) {
          if (!this.listWithRequiredFields.listFields.includes(key)) {
            return left(new UnnecessaryFieldError(key))
          }
        }
      }
    }
    return right(null)
  }
}
