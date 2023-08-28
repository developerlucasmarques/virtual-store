import type { Either } from '@/shared/either'
import type { InvalidProductAmountError, InvalidProductDescriptionError, InvalidProductNameError } from '../errors'
import type { Product } from '../product'

export type CreateProductResponse = Either<
InvalidProductNameError | InvalidProductAmountError | InvalidProductDescriptionError, Product
>
