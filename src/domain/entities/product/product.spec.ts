import { left } from '@/shared/either'
import { ProductName } from './value-objects'
import { InvalidProductNameError } from './errors'
import { Product, type ProductData } from './product'

const makeFakeProductData = (): ProductData => ({
  name: 'any_name',
  amount: 10.90,
  description: 'any_description'
})

describe('Product Entity', () => {
  it('Should return InvalidProductName if create ProductName fails', () => {
    jest.spyOn(ProductName, 'create').mockReturnValueOnce(
      left(new InvalidProductNameError('any_name'))
    )
    const sut = Product.create(makeFakeProductData())
    expect(sut.value).toEqual(new InvalidProductNameError('any_name'))
  })
})
