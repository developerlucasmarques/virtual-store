import type { IdValidator } from '@/presentation/contracts'
import { MissingParamError } from '@/presentation/errors'
import { InvalidIdError } from '@/presentation/errors/invalid-id-error'
import { IdTypeValidation } from './id-type-validation'

const makeIdValidator = (): IdValidator => {
  class IdValidatorStub implements IdValidator {
    isValid (id: string): boolean {
      return true
    }
  }
  return new IdValidatorStub()
}

type SutTypes = {
  sut: IdTypeValidation
  idValidatorStub: IdValidator
}

const makeSut = (): SutTypes => {
  const idValidatorStub = makeIdValidator()
  const sut = new IdTypeValidation('userId', idValidatorStub)
  return {
    sut,
    idValidatorStub
  }
}

describe('IdType Validation', () => {
  it('Should return MissingParamError if not informed value', () => {
    const { sut } = makeSut()
    const result = sut.validate({})
    expect(result.value).toEqual(new MissingParamError('userId'))
  })

  it('Should call IdValidator with correct id', () => {
    const { sut, idValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(idValidatorStub, 'isValid')
    sut.validate({ userId: 'any_id' })
    expect(isValidSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return InvalidIdError if IdValidator fails', () => {
    const { sut, idValidatorStub } = makeSut()
    jest.spyOn(idValidatorStub, 'isValid').mockReturnValueOnce(false)
    const result = sut.validate({ userId: 'any_id' })
    expect(result.value).toEqual(new InvalidIdError('any_id'))
  })

  it('Should return null if IdValidator is a success', () => {
    const { sut } = makeSut()
    const result = sut.validate({ userId: 'any_id' })
    expect(result.value).toEqual(null)
  })
})
