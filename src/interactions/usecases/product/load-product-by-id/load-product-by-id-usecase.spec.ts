import type { ProductModel } from '@/domain/models'
import { ProductNotFoundError } from '@/domain/usecases-contracts/errors'
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

  it('Should return ProductNotFoundError if LoadProductByIdRepo returns null', async () => {
    const { sut, loadProductByIdRepoStub } = makeSut()
    jest.spyOn(loadProductByIdRepoStub, 'loadById').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.perform('any_product_id')
    expect(result.value).toEqual(new ProductNotFoundError('any_product_id'))
  })

  it('Should throw if LoadProductByIdRepo throws', async () => {
    const { sut, loadProductByIdRepoStub } = makeSut()
    jest.spyOn(loadProductByIdRepoStub, 'loadById').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform('any_product_id')
    await expect(promise).rejects.toThrow()
  })

  it('Should return ProductModel if LoadProductByIdRepo is a success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform('any_product_id')
    expect(result.value).toEqual(makeFakeProductModel())
  })
})
