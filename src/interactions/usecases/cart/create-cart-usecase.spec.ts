import type { AddProductToCartData, CreateCart } from '@/domain/usecases-contracts'
import type { CreateCartRepo, CreateCartRepoData, Id, IdBuilder, LoadProductByIdRepo } from '@/interactions/contracts'
import { CreateCartUseCase } from './create-cart-usecase'
import { type ProductModel } from '@/domain/models'
import { ProductNotFoundError } from '@/domain/usecases-contracts/errors'

const makeFakeAddProductToCartData = (): AddProductToCartData => ({
  userId: 'any_user_id',
  productId: 'any_product_id',
  productQty: 2
})

const makeFakeProductModel = (): ProductModel => ({
  id: 'any_id',
  name: 'any name',
  amount: 10.90,
  description: 'any description'
})

const makeFakeCreateCartRepoData = (): CreateCartRepoData => ({
  id: 'any_id',
  userId: 'any_user_id',
  productId: 'any_product_id',
  productQty: 2
})

const makeLoadProductByIdRepo = (): LoadProductByIdRepo => {
  class LoadProductByIdRepoStub implements LoadProductByIdRepo {
    async loadById (id: string): Promise<null | ProductModel> {
      return await Promise.resolve(makeFakeProductModel())
    }
  }
  return new LoadProductByIdRepoStub()
}

const makeIdBuilder = (): IdBuilder => {
  class IdBuilderStub implements IdBuilder {
    build (): Id {
      return { id: 'any_id' }
    }
  }
  return new IdBuilderStub()
}

const makeCreateCartRepo = (): CreateCartRepo => {
  class CreateCartRepoStub implements CreateCartRepo {
    async create (data: CreateCartRepoData): Promise<void> {
      await Promise.resolve()
    }
  }
  return new CreateCartRepoStub()
}

type SutTypes = {
  sut: CreateCart
  idBuilderStub: IdBuilder
  loadProductByIdRepoStub: LoadProductByIdRepo
  createCartRepoStub: CreateCartRepo
}

const makeSut = (): SutTypes => {
  const idBuilderStub = makeIdBuilder()
  const loadProductByIdRepoStub = makeLoadProductByIdRepo()
  const createCartRepoStub = makeCreateCartRepo()
  const sut = new CreateCartUseCase(loadProductByIdRepoStub, idBuilderStub, createCartRepoStub)
  return {
    sut,
    loadProductByIdRepoStub,
    idBuilderStub,
    createCartRepoStub
  }
}

describe('CreateCart UseCase', () => {
  it('Should call LoadProductByIdRepo with correct product id', async () => {
    const { sut, loadProductByIdRepoStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadProductByIdRepoStub, 'loadById')
    await sut.perform(makeFakeAddProductToCartData())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_product_id')
  })

  it('Should return ProductNotFoundError if LoadProductByIdRepo returns null', async () => {
    const { sut, loadProductByIdRepoStub } = makeSut()
    jest.spyOn(loadProductByIdRepoStub, 'loadById').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.perform(makeFakeAddProductToCartData())
    expect(result.value).toEqual(new ProductNotFoundError('any_product_id'))
  })

  it('Should throw if LoadProductByIdRepo throws', async () => {
    const { sut, loadProductByIdRepoStub } = makeSut()
    jest.spyOn(loadProductByIdRepoStub, 'loadById').mockImplementation(() => {
      throw new Error()
    })
    const promise = sut.perform(makeFakeAddProductToCartData())
    await expect(promise).rejects.toThrow()
  })

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

  it('Should return null if CreateCartRepo is a success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform(makeFakeAddProductToCartData())
    expect(result.value).toBeNull()
  })
})
