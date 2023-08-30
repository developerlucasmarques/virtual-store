import { IdMongo } from '@/external/db/mongo-db/id/id-mongo'
import type { Validation } from '@/presentation/contracts'
import { ValidationComposite } from '@/presentation/helpers/validators'
import { IdTypeValidation } from '@/presentation/helpers/validators/id-type-validation'
import { makeLoadProductByIdValidation } from './load-product-by-id-validation-factory'

jest.mock('@/presentation/helpers/validators/validation-composite')

describe('LoadProductByIdValidation Factory', () => {
  it('Should call ValidationComposite with validation', () => {
    makeLoadProductByIdValidation()
    const validations: Validation[] = []
    const idValidator = new IdMongo()
    validations.push(
      new IdTypeValidation('productId', idValidator)
    )
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
