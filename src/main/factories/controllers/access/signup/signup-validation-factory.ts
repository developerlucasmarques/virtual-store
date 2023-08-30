import type { Validation } from '@/presentation/contracts'
import { CompareFieldsValidation, OnlyRequiredFieldsValidation, PrimitiveTypeValidation, RequiredFieldValidation, ValidationComposite } from '@/presentation/helpers/validators'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of requiredFields) {
    validations.push(
      new RequiredFieldValidation(field),
      new PrimitiveTypeValidation(field, 'string')
    )
  }
  validations.push(
    new OnlyRequiredFieldsValidation(requiredFields),
    new CompareFieldsValidation('password', 'passwordConfirmation')
  )
  return new ValidationComposite(validations)
}
