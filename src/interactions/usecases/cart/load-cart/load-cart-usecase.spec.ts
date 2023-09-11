import type { CartModel } from '@/domain/models'
import type { LoadCartByUserIdRepo } from '@/interactions/contracts'
import { LoadCartUseCase } from './load-cart-usecase'

const makeFakeCartModel = (): CartModel => ({
  id: 'any_id',
  userId: 'any_user_id',
  products: [{
    id: 'any_product_id_1',
    quantity: 1
  }, {
    id: 'any_product_id_2',
    quantity: 2
  }]
})

const makeLoadCartByUserIdRepo = (): LoadCartByUserIdRepo => {
  class LoadCartByUserIdRepoStub implements LoadCartByUserIdRepo {
    async loadByUserId (userId: string): Promise<null | CartModel> {
      return await Promise.resolve(makeFakeCartModel())
    }
  }
  return new LoadCartByUserIdRepoStub()
}

type SutTypes = {
  sut: LoadCartUseCase
  loadCartByUserIdRepoStub: LoadCartByUserIdRepo
}

const makeSut = (): SutTypes => {
  const loadCartByUserIdRepoStub = makeLoadCartByUserIdRepo()
  const sut = new LoadCartUseCase(loadCartByUserIdRepoStub)
  return {
    sut,
    loadCartByUserIdRepoStub
  }
}

describe('LoadCart UseCase', () => {
  it('Should call LoadCartByUserIdRepo with correct user id', async () => {
    const { sut, loadCartByUserIdRepoStub } = makeSut()
    const loadByUserIdSpy = jest.spyOn(loadCartByUserIdRepoStub, 'loadByUserId')
    await sut.perform('any_user_id')
    expect(loadByUserIdSpy).toHaveBeenCalledWith('any_user_id')
  })
})
