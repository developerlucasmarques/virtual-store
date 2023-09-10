import type { Validation } from '@/presentation/contracts'
import { OnlyRequiredFieldsValidation, PrimitiveTypeValidation, RequiredFieldValidation, ValidationComposite } from '@/presentation/helpers/validators'
import { makeAddProductToCartValidation } from './add-product-to-cart-validation-factory'

jest.mock('@/presentation/helpers/validators/validation-composite')

describe('AddProductToCartValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeAddProductToCartValidation()
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
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
