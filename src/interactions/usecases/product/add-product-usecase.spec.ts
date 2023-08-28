import { Product, type ProductData } from '@/domain/entities/product'
import { AddProductUseCase } from './add-product-usecase'
import { left } from '@/shared/either'
import type { Id, IdBuilder } from '@/interactions/contracts'

const makeFakeProductData = (): ProductData => ({
  name: 'any name',
  amount: 10.90,
  description: 'any description'
})

const makeIdBuilderStub = (): IdBuilder => {
  class IdBuilderStub implements IdBuilder {
    build (): Id {
      return { id: 'any_id' }
    }
  }
  return new IdBuilderStub()
}

type SutTypes = {
  sut: AddProductUseCase
  idBuilderStub: IdBuilder
}

const makeSut = (): SutTypes => {
  const idBuilderStub = makeIdBuilderStub()
  const sut = new AddProductUseCase(idBuilderStub)
  return {
    sut,
    idBuilderStub
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
})
