import { Product, type ProductData } from '@/domain/entities/product'
import { AddProductUseCase } from './add-product-usecase'
import { left } from '@/shared/either'
import type { AddProductRepo, Id, IdBuilder } from '@/interactions/contracts'
import type { ProductModel } from '@/domain/models'

const makeFakeProductData = (): ProductData => ({
  name: 'any name',
  amount: 10.90,
  description: 'any description'
})

const makeFakeProductModel = (): ProductModel => ({
  id: 'any_id',
  name: 'any name',
  amount: 10.90,
  description: 'any description'
})

const makeIdBuilder = (): IdBuilder => {
  class IdBuilderStub implements IdBuilder {
    build (): Id {
      return { id: 'any_id' }
    }
  }
  return new IdBuilderStub()
}

const makeAddProductRepo = (): AddProductRepo => {
  class AddProductRepoStub implements AddProductRepo {
    async add (data: ProductModel): Promise<void> {
      await Promise.resolve()
    }
  }
  return new AddProductRepoStub()
}

type SutTypes = {
  sut: AddProductUseCase
  idBuilderStub: IdBuilder
  addProductRepoStub: AddProductRepo
}

const makeSut = (): SutTypes => {
  const idBuilderStub = makeIdBuilder()
  const addProductRepoStub = makeAddProductRepo()
  const sut = new AddProductUseCase(idBuilderStub, addProductRepoStub)
  return {
    sut,
    idBuilderStub,
    addProductRepoStub
  }
}

describe('AddProduct UseCase', () => {
  it('Should call Product Entity with correct values', async () => {
    const { sut } = makeSut()
    const createSpy = jest.spyOn(Product, 'create')
    await sut.perform(makeFakeProductData())
    expect(createSpy).toHaveBeenCalledWith(makeFakeProductData())
  })

  it('Should return a Error if create Product fails', async () => {
    const { sut } = makeSut()
    jest.spyOn(Product, 'create').mockReturnValueOnce(
      left(new Error('any message'))
    )
    const result = await sut.perform(makeFakeProductData())
    expect(result.value).toEqual(new Error('any message'))
  })

  it('Should call IdBuilder', async () => {
    const { sut, idBuilderStub } = makeSut()
    const buildSpy = jest.spyOn(idBuilderStub, 'build')
    await sut.perform(makeFakeProductData())
    expect(buildSpy).toHaveBeenCalled()
  })

  it('Should throw if IdBuilder throws', async () => {
    const { sut, idBuilderStub } = makeSut()
    jest.spyOn(idBuilderStub, 'build').mockImplementation(() => {
      throw new Error()
    })
    const promise = sut.perform(makeFakeProductData())
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddProductRepo with ProductModel', async () => {
    const { sut, addProductRepoStub } = makeSut()
    const addSpy = jest.spyOn(addProductRepoStub, 'add')
    await sut.perform(makeFakeProductData())
    expect(addSpy).toHaveBeenCalledWith(makeFakeProductModel())
  })

  it('Should throw if AddProductRepo throws', async () => {
    const { sut, addProductRepoStub } = makeSut()
    jest.spyOn(addProductRepoStub, 'add').mockImplementation(() => {
      throw new Error()
    })
    const promise = sut.perform(makeFakeProductData())
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if AddProductRepo on success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform(makeFakeProductData())
    expect(result.value).toBe(null)
  })
})
