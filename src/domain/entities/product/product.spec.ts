import { left } from '@/shared/either'
import { ProductAmount, ProductDescription, ProductName } from './value-objects'
import { InvalidProductAmountError, InvalidProductDescriptionError, InvalidProductNameError } from './errors'
import { type ProductData, Product } from '.'

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

  it('Should return InvalidProductDescriptionError if create ProductDescription fails', () => {
    jest.spyOn(ProductDescription, 'create').mockReturnValueOnce(
      left(new InvalidProductDescriptionError('invalid description'))
    )
    const sut = Product.create(makeFakeProductData())
    expect(sut.value).toEqual(new InvalidProductDescriptionError('invalid description'))
  })

  it('Should return an Product if create on success', () => {
    const sut = Product.create(makeFakeProductData())
    expect(sut.value).toEqual({
      name: { name: 'any_name' },
      amount: { amount: 10.90 },
      description: { description: 'any_description' }
    })
  })
})
