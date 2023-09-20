import type { Validation } from '@/presentation/contracts'
import { OnlyRequiredFieldsValidation, RequiredFieldValidation, ValidationComposite } from '@/presentation/helpers/validators'
import { makeTransactionManagerValidation } from './transaction-manager-validation-factory'

jest.mock('@/presentation/helpers/validators/validation-composite')

describe('TransactionManagerValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeTransactionManagerValidation()
    const validations: Validation[] = []
    validations.push(new RequiredFieldValidation('payload'))
    validations.push(new OnlyRequiredFieldsValidation(['payload']))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
