import type { ProductModel } from '@/domain/models'
import type { LoadAllProductsRepo } from '@/interactions/contracts'
import { LoadAllProductsUseCase } from './load-all-products-usecase'

const makeFakeProductModel = (): ProductModel[] => [{
  id: 'any_id',
  name: 'any name',
  amount: 10.90,
  description: 'any description'
}, {
  id: 'another_id',
  name: 'another name',
  amount: 20.90,
  description: 'another description'
}]

const makeLoadAllProductsStub = (): LoadAllProductsRepo => {
  class LoadAllProductsRepoStub implements LoadAllProductsRepo {
    async loadAll (): Promise<ProductModel[]> {
      return await Promise.resolve(makeFakeProductModel())
    }
  }
  return new LoadAllProductsRepoStub()
}

type SutTypes = {
  sut: LoadAllProductsUseCase
  loadAllProductsRepoStub: LoadAllProductsRepo
}

const makeSut = (): SutTypes => {
  const loadAllProductsRepoStub = makeLoadAllProductsStub()
  const sut = new LoadAllProductsUseCase(loadAllProductsRepoStub)
  return {
    sut,
    loadAllProductsRepoStub
  }
}

describe('LoadAllProducts UseCase', () => {
  it('Should call LoadAllProductsRepo', async () => {
    const { sut, loadAllProductsRepoStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadAllProductsRepoStub, 'loadAll')
    await sut.perform()
    expect(loadAllSpy).toHaveBeenCalled()
  })
})
