import { IdMongo } from '@/external/db/mongo-db/id/id-mongo'
import type { Validation } from '@/presentation/contracts'
import { OnlyRequiredFieldsValidation, PrimitiveTypeValidation, RequiredFieldValidation, ValidationComposite } from '@/presentation/helpers/validators'
import { IdTypeValidation } from '@/presentation/helpers/validators/id-type-validation'

export const makeAddProductToCartValidation = (): ValidationComposite => {
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
  return new ValidationComposite(validations)
}
