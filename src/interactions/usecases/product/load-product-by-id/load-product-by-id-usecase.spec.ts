import type { ProductModel } from '@/domain/models'
import type { LoadProductByIdRepo } from '@/interactions/contracts'
import { LoadProductByIdUseCase } from './load-product-by-id-usecase'

const makeFakeProductModel = (): ProductModel => ({
  id: 'any_id',
  name: 'any name',
  amount: 10.90,
  description: 'any description'
})

const makeLoadProductByIdRepo = (): LoadProductByIdRepo => {
  class LoadProductByIdRepoStub implements LoadProductByIdRepo {
    async loadById (id: string): Promise<null | ProductModel> {
      return await Promise.resolve(makeFakeProductModel())
    }
  }
  return new LoadProductByIdRepoStub()
}

type SutTypes = {
  sut: LoadProductByIdUseCase
  loadProductByIdRepoStub: LoadProductByIdRepo
}

const makeSut = (): SutTypes => {
  const loadProductByIdRepoStub = makeLoadProductByIdRepo()
  const sut = new LoadProductByIdUseCase(loadProductByIdRepoStub)
  return {
    sut,
    loadProductByIdRepoStub
  }
}

describe('LoadProductById UseCase', () => {
  it('Should call LoadProductByIdRepo with correct id', async () => {
    const { sut, loadProductByIdRepoStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadProductByIdRepoStub, 'loadById')
    await sut.perform('any_product_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_product_id')
  })
})
