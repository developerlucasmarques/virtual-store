import type { CompleteCartModel } from '@/domain/models'
import type { LoadCart, LoadCartResponse } from '@/domain/usecases-contracts'
import type { HttpRequest } from '@/presentation/http-types/http'
import { left, right } from '@/shared/either'
import { LoadCartController } from './load-cart-controller'
import { badRequest } from '@/presentation/helpers/http/http-helpers'

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

  it('Should return 400 if LoadCart returns an error', async () => {
    const { sut, loadCartStub } = makeSut()
    jest.spyOn(loadCartStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })
})
