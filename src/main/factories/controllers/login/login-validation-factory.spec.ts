import type { Validation } from '@/presentation/contracts'
import { makeLoginValidation } from './login-validation-factory'
import { OnlyRequiredFieldsValidation, PrimitiveTypeValidation, RequiredFieldValidation, ValidationComposite } from '@/presentation/helpers/validators'

jest.mock('@/presentation/helpers/validators/validation-composite')

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      validations.push(
        new RequiredFieldValidation(field),
        new PrimitiveTypeValidation(field, 'string')
      )
    }
    validations.push(new OnlyRequiredFieldsValidation(requiredFields))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
