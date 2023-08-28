import type { Validation } from '@/presentation/contracts'
import type { HttpRequest } from '@/presentation/http-types/http'
import { type Either, right, left } from '@/shared/either'
import { AddProductController } from './add-product-controller'
import { badRequest, serverError } from '@/presentation/helpers/http/http-helpers'
import { ServerError } from '@/presentation/errors'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any name',
    description: 'any_description',
    amount: 10.90
  }
})

const makeValidationComposite = (): Validation => {
  class ValidationCompositeStub implements Validation {
    validate (input: any): Either<Error, null> {
      return right(null)
    }
  }
  return new ValidationCompositeStub()
}

type SutTypes = {
  sut: AddProductController
  validationCompositeStub: Validation
}

const makeSut = (): SutTypes => {
  const validationCompositeStub = makeValidationComposite()
  const sut = new AddProductController(validationCompositeStub)
  return {
    sut,
    validationCompositeStub
  }
}

describe('AddProduct Controller', () => {
  it('Should call ValidationComposite with correct values', async () => {
    const { sut, validationCompositeStub } = makeSut()
    const validateSpy = jest.spyOn(validationCompositeStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenLastCalledWith(makeFakeRequest().body)
  })

  it('Should return 400 if ValidationComposite fails', async () => {
    const { sut, validationCompositeStub } = makeSut()
    jest.spyOn(validationCompositeStub, 'validate').mockReturnValueOnce(
      left(new Error('any_message'))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })

  it('Should return 500 if ValidationComposite throws', async () => {
    const { sut, validationCompositeStub } = makeSut()
    jest.spyOn(validationCompositeStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    const error = new Error()
    expect(httpResponse).toEqual(serverError(new ServerError(error.stack)))
  })
})
