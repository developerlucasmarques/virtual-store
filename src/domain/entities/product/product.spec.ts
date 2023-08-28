import { left } from '@/shared/either'
import { ProductAmount, ProductName } from './value-objects'
import { InvalidProductAmountError, InvalidProductNameError } from './errors'
import { Product, type ProductData } from './product'

const makeFakeProductData = (): ProductData => ({
  name: 'any_name',
  amount: 10.90,
  description: 'any_description'
})

describe('Product Entity', () => {
  it('Should return InvalidProductNameError if create ProductName fails', () => {
    jest.spyOn(ProductName, 'create').mockReturnValueOnce(
      left(new InvalidProductNameError('any_name'))
    )
    const sut = Product.create(makeFakeProductData())
    expect(sut.value).toEqual(new InvalidProductNameError('any_name'))
  })

  it('Should return InvalidProductAmountError if create ProductAmount fails', () => {
    jest.spyOn(ProductAmount, 'create').mockReturnValueOnce(
      left(new InvalidProductAmountError(10))
    )
    const sut = Product.create(makeFakeProductData())
    expect(sut.value).toEqual(new InvalidProductAmountError(10))
  })
})
