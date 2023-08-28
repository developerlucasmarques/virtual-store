import type { ProductData } from '@/domain/entities/product'
import type { InvalidProductAmountError, InvalidProductDescriptionError, InvalidProductNameError } from '@/domain/entities/product/errors'
import type { Either } from '@/shared/either'

export type AddProductResponse = Either<
InvalidProductNameError | InvalidProductAmountError | InvalidProductDescriptionError, void
>

export interface AddProduct {
  perform: (data: ProductData) => Promise<AddProductResponse>
}
