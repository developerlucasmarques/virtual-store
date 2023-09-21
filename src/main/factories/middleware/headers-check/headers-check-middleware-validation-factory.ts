import type { Validation } from '@/presentation/contracts'
import { PrimitiveTypeValidation, RequiredFieldValidation, ValidationComposite } from '@/presentation/helpers/validators'

export const makeHeadersCheckMiddlewareValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  validations.push(
    new RequiredFieldValidation('stripe-signature'),
    new PrimitiveTypeValidation('stripe-signature', 'string')
  )
  return new ValidationComposite(validations)
}
