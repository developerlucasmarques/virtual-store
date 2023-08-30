import type { IdValidator } from '@/presentation/contracts'
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
  it('Should call IdValidator with correct id', () => {
    const { sut, idValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(idValidatorStub, 'isValid')
    sut.validate({ userId: 'any_id' })
    expect(isValidSpy).toHaveBeenCalledWith('any_id')
  })
})
