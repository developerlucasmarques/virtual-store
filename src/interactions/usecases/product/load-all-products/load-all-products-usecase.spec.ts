import type { ProductModel } from '@/domain/models'
import type { LoadAllProductsRepo } from '@/interactions/contracts'
import { LoadAllProductsUseCase } from './load-all-products-usecase'

const makeFakeProducts = (): ProductModel[] => [{
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

const makeLoadAllProductsRepo = (): LoadAllProductsRepo => {
  class LoadAllProductsRepoStub implements LoadAllProductsRepo {
    async loadAll (): Promise<ProductModel[]> {
      return await Promise.resolve(makeFakeProducts())
    }
  }
  return new LoadAllProductsRepoStub()
}

type SutTypes = {
  sut: LoadAllProductsUseCase
  loadAllProductsRepoStub: LoadAllProductsRepo
}

const makeSut = (): SutTypes => {
  const loadAllProductsRepoStub = makeLoadAllProductsRepo()
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

  it('Should throw if LoadAllProductsRepo throws', async () => {
    const { sut, loadAllProductsRepoStub } = makeSut()
    jest.spyOn(loadAllProductsRepoStub, 'loadAll').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform()
    await expect(promise).rejects.toThrow()
  })

  test('Should return the same as LoadAllProductsRepo returns', async () => {
    const { sut } = makeSut()
    const surveys = await sut.perform()
    expect(surveys).toEqual(makeFakeProducts())
  })
})
