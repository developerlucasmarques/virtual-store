import type { Validation } from '@/presentation/contracts'
import { makeSignUpValidation } from './signup-validation-factory'
import { CompareFieldsValidation, OnlyRequiredFieldsValidation, PrimitiveTypeValidation, RequiredFieldValidation, ValidationComposite } from '@/presentation/helpers/validators'

jest.mock('@/presentation/helpers/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
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
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
