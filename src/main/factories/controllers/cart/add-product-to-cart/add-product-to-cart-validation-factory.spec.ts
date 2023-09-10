import type { Validation } from '@/presentation/contracts'
import { OnlyRequiredFieldsValidation, PrimitiveTypeValidation, RequiredFieldValidation, ValidationComposite } from '@/presentation/helpers/validators'
import { makeAddProductToCartValidation } from './add-product-to-cart-validation-factory'
import { IdTypeValidation } from '@/presentation/helpers/validators/id-type-validation'
import { IdMongo } from '@/external/db/mongo-db/id/id-mongo'

jest.mock('@/presentation/helpers/validators/validation-composite')

describe('AddProductToCartValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeAddProductToCartValidation()
    const validations: Validation[] = []
    const requiredFields = ['productId', 'productQty']
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    const idValidator = new IdMongo()
    validations.push(
      new PrimitiveTypeValidation('productId', 'string'),
      new PrimitiveTypeValidation('productQty', 'number'),
      new OnlyRequiredFieldsValidation(requiredFields),
      new IdTypeValidation('productId', idValidator)
    )
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
