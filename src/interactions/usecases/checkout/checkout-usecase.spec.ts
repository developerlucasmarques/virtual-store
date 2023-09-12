import type { CompleteCartModel } from '@/domain/models'
import type { LoadCart, LoadCartResponse } from '@/domain/usecases-contracts'
import { right } from '@/shared/either'
import { CheckoutUseCase } from './checkout-usecase'

const makeFakeCompleteCartModel = (): CompleteCartModel => ({
  total: 151.67,
  products: [{
    id: 'any_product_id_1',
    name: 'any name',
    amount: 10.90,
    quantity: 1
  }, {
    id: 'any_product_id_2',
    name: 'any name 2',
    amount: 20.90,
    quantity: 2
  }, {
    id: 'any_product_id_3',
    name: 'any name 3',
    amount: 32.99,
    quantity: 3
  }]
})

const makeLoadCartStub = (): LoadCart => {
  class LoadCartStub implements LoadCart {
    async perform (userId: string): Promise<LoadCartResponse> {
      return await Promise.resolve(right(makeFakeCompleteCartModel()))
    }
  }
  return new LoadCartStub()
}

type SutTypes = {
  sut: CheckoutUseCase
  loadCartStub: LoadCart
}

const makeSut = (): SutTypes => {
  const loadCartStub = makeLoadCartStub()
  const sut = new CheckoutUseCase(loadCartStub)
  return {
    sut,
    loadCartStub
  }
}

describe('Checkout UseCase', () => {
  it('Should call LoadCart with correct user id', async () => {
    const { sut, loadCartStub } = makeSut()
    const performSpy = jest.spyOn(loadCartStub, 'perform')
    await sut.perform('any_user_id')
    expect(performSpy).toHaveBeenCalledWith('any_user_id')
  })
})
