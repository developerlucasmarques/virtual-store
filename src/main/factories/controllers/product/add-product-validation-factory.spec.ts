import type { Validation } from '@/presentation/contracts'
import { OnlyRequiredFieldsValidation, PrimitiveTypeValidation, RequiredFieldValidation, ValidationComposite } from '@/presentation/helpers/validators'
import { makeAddProductValidation } from './add-product-validation-factory'

jest.mock('@/presentation/helpers/validators/validation-composite')

describe('AddProductValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeAddProductValidation()
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
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
