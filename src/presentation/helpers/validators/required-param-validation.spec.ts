import { InvalidParamsError } from '@/presentation/errors/invalid-params-error'
import { RequiredParamValidation } from './required-param-validation'

const makeSut = (paramName: string): RequiredParamValidation => {
  return new RequiredParamValidation(paramName)
}

describe('RequiredParam Validation', () => {
  it('Should return InvalidParamsError if not informed required param', () => {
    const sut = makeSut('userId')
    const result = sut.validate({ paramId: 'any_id' })
    expect(result.value).toEqual(new InvalidParamsError('userId'))
  })

  it('Should return null if informed required param', () => {
    const sut = makeSut('userId')
    const result = sut.validate({ userId: 'any_id' })
    expect(result.value).toBe(null)
  })
})
