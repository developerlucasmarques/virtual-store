import { IdMongo } from '@/external/db/mongo-db/id/id-mongo'
import type { Validation } from '@/presentation/contracts'
import { ValidationComposite } from '@/presentation/helpers/validators'
import { IdTypeValidation } from '@/presentation/helpers/validators/id-type-validation'

export const makeLoadProductByIdValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const idValidator = new IdMongo()
  validations.push(new IdTypeValidation('productId', idValidator))
  return new ValidationComposite(validations)
}
