import type { Validation } from '@/presentation/contracts'
import { OnlyRequiredFieldsValidation, PrimitiveTypeValidation, RequiredFieldValidation, ValidationComposite } from '@/presentation/helpers/validators'

export const makeAddProductValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['name', 'amount', 'description']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(
    new PrimitiveTypeValidation('name', 'string'),
    new PrimitiveTypeValidation('amount', 'number'),
    new PrimitiveTypeValidation('description', 'string'),
    new OnlyRequiredFieldsValidation(requiredFields)
  )
  return new ValidationComposite(validations)
}
