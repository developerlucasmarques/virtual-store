import type { ProductModel } from '@/domain/models'
import type { LoadAllProducts } from '@/domain/usecases-contracts'
import { LoadAllProductsController } from './load-all-products-controller'

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

const makeLoadAllProductsStub = (): LoadAllProducts => {
  class LoadAllProductsStub implements LoadAllProducts {
    async perform (): Promise<ProductModel[]> {
      return await Promise.resolve(makeFakeProducts())
    }
  }
  return new LoadAllProductsStub()
}

type SutTypes = {
  sut: LoadAllProductsController
  loadAllProductsStub: LoadAllProducts
}

const makeSut = (): SutTypes => {
  const loadAllProductsStub = makeLoadAllProductsStub()
  const sut = new LoadAllProductsController(loadAllProductsStub)
  return {
    sut,
    loadAllProductsStub
  }
}

describe('LoadAllProducts Controller', () => {
  it('Should call LoadAllProducts', async () => {
    const { sut, loadAllProductsStub } = makeSut()
    const performSpy = jest.spyOn(loadAllProductsStub, 'perform')
    await sut.handle({})
    expect(performSpy).toHaveBeenCalled()
  })
})
