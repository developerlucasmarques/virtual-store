import { InvalidProductDescriptionError } from '../errors'
import { ProductDescription } from './product-description'

describe('ProductDescription ValueObject', () => {
  it('Should return InvalidProductDescriptionError if length of description is less than 10 characters', () => {
    const description = 'a'.repeat(9)
    const sut = ProductDescription.create(description)
    expect(sut.value).toEqual(new InvalidProductDescriptionError(description))
  })

  it('Should return InvalidProductDescriptionError if length of description is greater than 500 characters', () => {
    const description = 'a'.repeat(501)
    const sut = ProductDescription.create(description)
    expect(sut.value).toEqual(new InvalidProductDescriptionError(description))
  })

  it('Should remove the spaces at the beginning and at the end of the description', () => {
    const sut = ProductDescription.create(' any description ')
    expect(sut.value).toEqual({ description: 'any description' })
  })

  it('Should remove spaces between words if have any', () => {
    const sut = ProductDescription.create('any  description    any  description')
    expect(sut.value).toEqual({ description: 'any description any description' })
  })

  it('Should return an ProductDescription if description is valid', () => {
    const sut = ProductDescription.create('valid description')
    expect(sut.value).toEqual({ description: 'valid description' })
  })
})
