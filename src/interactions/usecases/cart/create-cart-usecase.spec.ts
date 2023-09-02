import type { AddProductToCartData, CreateCart } from '@/domain/usecases-contracts'
import type { CreateCartRepo, CreateCartRepoData, Id, IdBuilder } from '@/interactions/contracts'
import { CreateCartUseCase } from './create-cart-usecase'

const makeFakeAddProductToCartData = (): AddProductToCartData => ({
  userId: 'any_user_id',
  productId: 'any_product_id',
  productQty: 2
})

const makeFakeCreateCartRepoData = (): CreateCartRepoData => ({
  id: 'any_id',
  userId: 'any_user_id',
  productId: 'any_product_id',
  productQty: 2
})

const makeCreateCartRepo = (): CreateCartRepo => {
  class CreateCartRepoStub implements CreateCartRepo {
    async create (data: CreateCartRepoData): Promise<void> {
      await Promise.resolve()
    }
  }
  return new CreateCartRepoStub()
}

const makeIdBuilder = (): IdBuilder => {
  class IdBuilderStub implements IdBuilder {
    build (): Id {
      return { id: 'any_id' }
    }
  }
  return new IdBuilderStub()
}

type SutTypes = {
  sut: CreateCart
  idBuilderStub: IdBuilder
  createCartRepoStub: CreateCartRepo
}

const makeSut = (): SutTypes => {
  const idBuilderStub = makeIdBuilder()
  const createCartRepoStub = makeCreateCartRepo()
  const sut = new CreateCartUseCase(idBuilderStub, createCartRepoStub)
  return {
    sut,
    idBuilderStub,
    createCartRepoStub
  }
}

describe('CreateCart UseCase', () => {
  it('Should call IdBuilder', async () => {
    const { sut, idBuilderStub } = makeSut()
    const buildSpy = jest.spyOn(idBuilderStub, 'build')
    await sut.perform(makeFakeAddProductToCartData())
    expect(buildSpy).toHaveBeenCalled()
  })

  it('Should throw if IdBuilder throws', async () => {
    const { sut, idBuilderStub } = makeSut()
    jest.spyOn(idBuilderStub, 'build').mockImplementation(() => {
      throw new Error()
    })
    const promise = sut.perform(makeFakeAddProductToCartData())
    await expect(promise).rejects.toThrow()
  })

  it('Should call CreateCartRepo with correct values', async () => {
    const { sut, createCartRepoStub } = makeSut()
    const createSpy = jest.spyOn(createCartRepoStub, 'create')
    await sut.perform(makeFakeAddProductToCartData())
    expect(createSpy).toHaveBeenCalledWith(makeFakeCreateCartRepoData())
  })

  it('Should throw if CreateCartRepo throws', async () => {
    const { sut, createCartRepoStub } = makeSut()
    jest.spyOn(createCartRepoStub, 'create').mockImplementation(() => {
      throw new Error()
    })
    const promise = sut.perform(makeFakeAddProductToCartData())
    await expect(promise).rejects.toThrow()
  })
})
