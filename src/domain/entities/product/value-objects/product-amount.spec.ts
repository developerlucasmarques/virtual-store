import { InvalidProductAmount } from '../errors'
import { ProductAmount } from './product-amount'

describe('ProductAmount ValueObject', () => {
  it('Should return InvalidProductAmount if amount is less than 0', () => {
    const sut = ProductAmount.create(-1)
    expect(sut.value).toEqual(new InvalidProductAmount(-1))
  })

  it('Should return an ProductAmount if amount is float', () => {
    const sut = ProductAmount.create(10.29)
    expect(sut.value).toEqual({ amount: 10.29 })
  })

  it('Should return an ProductAmount if amount is valid', () => {
    const sut = ProductAmount.create(10)
    expect(sut.value).toEqual({ amount: 10 })
  })
})
