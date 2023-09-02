import type { AddProductToCartData, CreateCart, CreateCartReponse } from '@/domain/usecases-contracts'
import type { IdBuilder } from '@/interactions/contracts'
import { right } from '@/shared/either'

export class CreateCartUseCase implements CreateCart {
  constructor (private readonly idBuilder: IdBuilder) {}

  async perform (data: AddProductToCartData): Promise<CreateCartReponse> {
    this.idBuilder.build()
    return right(null)
  }
}
