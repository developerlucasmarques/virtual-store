import { InvalidProductQuantityError } from '@/domain/usecases-contracts/errors'
import { AddProductToCartUseCase } from './add-product-to-cart-usecase'

describe('AddProductToCart UseCase', () => {
  it('Should return InvalidProductQuantityError if productQty the less than 1', async () => {
    const sut = new AddProductToCartUseCase()
    const result = await sut.perform({
      productId: 'any_id',
      productQty: 0
    })
    expect(result.value).toEqual(new InvalidProductQuantityError())
  })
})
