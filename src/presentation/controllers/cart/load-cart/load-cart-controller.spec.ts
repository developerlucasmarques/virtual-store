import type { CompleteCartModel } from '@/domain/models'
import type { LoadCart, LoadCartResponse } from '@/domain/usecases-contracts'
import { ProductNotAvailableError } from '@/domain/usecases-contracts/errors'
import { notFound, ok, serverError } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest } from '@/presentation/http-types/http'
import { left, right } from '@/shared/either'
import { LoadCartController } from './load-cart-controller'

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    userId: 'any_user_id'
  }
})

const makeFakeCompleteCartModel = (): CompleteCartModel => ({
  total: 32.70,
  products: [{
    id: 'any_product_id',
    name: 'any name',
    amount: 10.90,
    quantity: 3
  }]
})

const makeLoadCart = (): LoadCart => {
  class LoadCartStub implements LoadCart {
    async perform (userId: string): Promise<LoadCartResponse> {
      return await Promise.resolve(right(makeFakeCompleteCartModel()))
    }
  }
  return new LoadCartStub()
}

type SutTypes = {
  sut: LoadCartController
  loadCartStub: LoadCart
}

const makeSut = (): SutTypes => {
  const loadCartStub = makeLoadCart()
  const sut = new LoadCartController(loadCartStub)
  return {
    sut,
    loadCartStub
  }
}

describe('LoadCart Controller', () => {
  it('Should call LoadCart with correct user id', async () => {
    const { sut, loadCartStub } = makeSut()
    const performSpy = jest.spyOn(loadCartStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledWith('any_user_id')
  })

  it('Should call LoadCart only once', async () => {
    const { sut, loadCartStub } = makeSut()
    const performSpy = jest.spyOn(loadCartStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledTimes(1)
  })

  it('Should return 404 if LoadCart returns ProductNotAvailableError', async () => {
    const { sut, loadCartStub } = makeSut()
    jest.spyOn(loadCartStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new ProductNotAvailableError('any_product_id')))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(notFound(new ProductNotAvailableError('any_product_id')))
  })

  it('Should return 500 if LoadCart throws', async () => {
    const { sut, loadCartStub } = makeSut()
    jest.spyOn(loadCartStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 200 if LoadCart is a success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeCompleteCartModel()))
  })
})
