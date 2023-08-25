import { ValidationTypeError } from '@/presentation/errors'
import { left, right } from '@/shared/either'
import { PrimitiveTypeValidation } from '.'

describe('PrimitiveType Validation', () => {
  it('Should return ValidationTypeError if validation fails', () => {
    const sut = new PrimitiveTypeValidation('name', 'string')
    const result = sut.validate({
      name: 0,
      email: 'any_email@mail.com'
    })
    expect(result).toEqual(left(new ValidationTypeError('name')))
  })

  it('Should return null if validation success', () => {
    const sut = new PrimitiveTypeValidation('name', 'string')
    const result = sut.validate({
      name: 'any name',
      email: 'any_email@mail.com'
    })
    expect(result).toEqual(right(null))
  })

  it('Should return ValidationTypeError if field type is array and validation fails', () => {
    const sut = new PrimitiveTypeValidation('messages', 'array')
    const result = sut.validate({
      name: 'any name',
      messages: 'invalid_field'
    })
    expect(result).toEqual(left(new ValidationTypeError('messages')))
  })

  it('Should return null if fieldType is array and validation success', () => {
    const sut = new PrimitiveTypeValidation('messages', 'array')
    const result = sut.validate({
      name: 'any name',
      messages: []
    })
    expect(result).toEqual(right(null))
  })
})
