import type { CompleteCartModel } from '@/domain/models'
import type { LoadCart, LoadCartResponse } from '@/domain/usecases-contracts'
import type { HttpRequest } from '@/presentation/http-types/http'
import { right } from '@/shared/either'
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
})
