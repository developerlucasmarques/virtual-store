import type { Validation } from '@/presentation/contracts'
import { OnlyRequiredFieldsValidation, PrimitiveTypeValidation, RequiredFieldValidation, ValidationComposite } from '@/presentation/helpers/validators'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['email', 'password']
  for (const field of requiredFields) {
    validations.push(
      new RequiredFieldValidation(field),
      new PrimitiveTypeValidation(field, 'string')
    )
  }
  validations.push(new OnlyRequiredFieldsValidation(requiredFields))
  return new ValidationComposite(validations)
}
