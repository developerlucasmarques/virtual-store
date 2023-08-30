import type { ProductModel } from '@/domain/models'
import type { Either } from '@/shared/either'
import type { ProductNotFoundError } from '../export-errors'

export type LoadProductByIdResponse = Either<ProductNotFoundError, ProductModel>

export interface LoadProductById {
  perform: (productId: string) => Promise<LoadProductByIdResponse>
}
