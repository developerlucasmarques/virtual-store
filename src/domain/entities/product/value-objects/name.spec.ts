import { InvalidProductNameError } from '../errors'
import { ProductName } from './name'

describe('ProductName ValueObject', () => {
  it('Should return InvalidProductNameError if length of name is less than 3 characters', () => {
    const sut = ProductName.create('ab')
    expect(sut.value).toEqual(new InvalidProductNameError('ab'))
  })

  it('Should return InvalidProductNameError if length of name is greater than 80 characters', () => {
    const name = 'a'.repeat(80)
    const sut = ProductName.create(name)
    expect(sut.value).toEqual(new InvalidProductNameError(name))
  })

  it('Should remove the spaces at the beginning and at the end of the name', () => {
    const sut = ProductName.create(' any name ')
    expect(sut.value).toEqual({ name: 'any name' })
  })

  it('Should remove spaces between words if have any', () => {
    const sut = ProductName.create('any  name    any  name')
    expect(sut.value).toEqual({ name: 'any name any name' })
  })

  it('Should return an ProductName if name is valid', () => {
    const sut = ProductName.create('valid name')
    expect(sut.value).toEqual({ name: 'valid name' })
  })
})
