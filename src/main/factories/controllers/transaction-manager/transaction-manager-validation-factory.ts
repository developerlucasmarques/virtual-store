import type { Validation } from '@/presentation/contracts'
import { OnlyRequiredFieldsValidation, RequiredFieldValidation, ValidationComposite } from '@/presentation/helpers/validators'

export const makeTransactionManagerValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  validations.push(new RequiredFieldValidation('payload'))
  validations.push(new OnlyRequiredFieldsValidation(['payload']))
  return new ValidationComposite(validations)
}
