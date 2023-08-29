import type { ProductModel } from '@/domain/models'
import type { Either } from '@/shared/either'
import type { InvalidIdError, ProductNotFoundError } from '../export-errors'

export type LoadProductByIdResponse = Either<InvalidIdError | ProductNotFoundError, ProductModel>

export interface LoadProductById {
  perform: (productId: string) => Promise<LoadProductByIdResponse>
}
