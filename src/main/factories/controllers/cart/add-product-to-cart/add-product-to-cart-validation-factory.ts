import type { Validation } from '@/presentation/contracts'
import { OnlyRequiredFieldsValidation, PrimitiveTypeValidation, RequiredFieldValidation, ValidationComposite } from '@/presentation/helpers/validators'

export const makeAddProductToCartValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['productId', 'productQty']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(
    new PrimitiveTypeValidation('productId', 'string'),
    new PrimitiveTypeValidation('productQty', 'number'),
    new OnlyRequiredFieldsValidation(requiredFields)
  )
  return new ValidationComposite(validations)
}
