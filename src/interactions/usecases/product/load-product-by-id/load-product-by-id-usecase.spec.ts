import type { ProductModel } from '@/domain/models'
import { ProductNotFoundError } from '@/domain/usecases-contracts/export-errors'
import type { LoadProductByIdRepo, ValidationId } from '@/interactions/contracts'
import { LoadProductByIdUseCase } from './load-product-by-id-usecase'

const makeFakeProductModel = (): ProductModel => ({
  id: 'any_id',
  name: 'any name',
  amount: 10.90,
  description: 'any description'
})

const makeValidationId = (): ValidationId => {
  class ValidationIdStub implements ValidationId {
    isValid (id: string): boolean {
      return true
    }
  }
  return new ValidationIdStub()
}

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
  validationIdStub: ValidationId
  loadProductByIdRepoStub: LoadProductByIdRepo
}

const makeSut = (): SutTypes => {
  const loadProductByIdRepoStub = makeLoadProductByIdRepo()
  const validationIdStub = makeValidationId()
  const sut = new LoadProductByIdUseCase(validationIdStub, loadProductByIdRepoStub)
  return {
    sut,
    validationIdStub,
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

  it('Should call ValidationId with correct id', async () => {
    const { sut, validationIdStub } = makeSut()
    const isValidSpy = jest.spyOn(validationIdStub, 'isValid')
    await sut.perform('any_product_id')
    expect(isValidSpy).toHaveBeenCalledWith('any_product_id')
  })
})
