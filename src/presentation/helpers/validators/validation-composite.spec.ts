import { ValidationComposite } from '.'
import { type Either, left, right } from '@/shared/either'
import type { Validation } from '@/presentation/contracts'
import { MissingParamError } from '@/presentation/errors'

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Either<Error, null> {
      return right(null)
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [
    makeValidationStub(),
    makeValidationStub()
  ]
  const sut = new ValidationComposite([validationStubs[0], validationStubs[1]])
  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(
      left(new MissingParamError('field'))
    )
    const result = sut.validate({ name: 'any name' })
    expect(result.value).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more the one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(left(new Error()))
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(
      left(new MissingParamError('name'))
    )
    const result = sut.validate({ field: 'any_field' })
    expect(result.value).toEqual(new Error())
  })

  test('Should return null if no validation fails', () => {
    const { sut } = makeSut()
    const result = sut.validate({ field: 'any_field' })
    expect(result.value).toBe(null)
  })
})
