import type { InvalidProductAmountError, InvalidProductDescriptionError, InvalidProductNameError } from '@/domain/entities/product/errors'
import type { Either } from '@/shared/either'

export type AddProductData = {
  name: string
  amount: number
  image: any
  description: string
}

export type AddProductResponse = Either<
InvalidProductNameError | InvalidProductAmountError | InvalidProductDescriptionError, void
>

export interface AddProduct {
  perform: (data: AddProductData) => Promise<AddProductResponse>
}
