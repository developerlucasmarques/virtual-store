import type { CartManagerData } from '@/domain/usecases-contracts'
import { InvalidProductQuantityError } from '@/domain/usecases-contracts/errors'
import type { LoadCartByUserIdRepo, LoadCartByUserIdRepoResponse } from '@/interactions/contracts'
import { CartManagerUseCase } from './cart-manager-usecase'

const makeFakeCartManagerData = (): CartManagerData => ({
  userId: 'any_user_id',
  productId: 'any_product_id',
  productQty: 2
})

const makeFakeLoadCartByUserIdRepoResponse = (): LoadCartByUserIdRepoResponse => ({
  id: 'any_id',
  userId: 'any_user_id',
  productIds: ['any_product_id_1', 'any_product_id_2']
})

const makeLoadCartByUserIdRepo = (): LoadCartByUserIdRepo => {
  class LoadCartByUserIdRepoStub implements LoadCartByUserIdRepo {
    async loadByUserId (userId: string): Promise<null | LoadCartByUserIdRepoResponse> {
      return await Promise.resolve(makeFakeLoadCartByUserIdRepoResponse())
    }
  }
  return new LoadCartByUserIdRepoStub()
}

type SutTypes = {
  sut: CartManagerUseCase
  loadCartByUserIdRepoStub: LoadCartByUserIdRepo
}

const makeSut = (): SutTypes => {
  const loadCartByUserIdRepoStub = makeLoadCartByUserIdRepo()
  const sut = new CartManagerUseCase(loadCartByUserIdRepoStub)
  return {
    sut,
    loadCartByUserIdRepoStub
  }
}

describe('CartManager UseCase', () => {
  it('Should return InvalidProductQuantityError if productQty the less than 1', async () => {
    const { sut } = makeSut()
    const result = await sut.perform({
      userId: 'any_user_id',
      productId: 'any_product_id',
      productQty: 0
    })
    expect(result.value).toEqual(new InvalidProductQuantityError())
  })

  it('Should call LoadCartByUserIdRepo whith corret user id', async () => {
    const { sut, loadCartByUserIdRepoStub } = makeSut()
    const loadByUserIdSpy = jest.spyOn(loadCartByUserIdRepoStub, 'loadByUserId')
    await sut.perform(makeFakeCartManagerData())
    expect(loadByUserIdSpy).toHaveBeenCalledWith('any_user_id')
  })
})
