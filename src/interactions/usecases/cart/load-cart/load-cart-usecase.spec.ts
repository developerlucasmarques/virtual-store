import type { CartModel, ProductModel } from '@/domain/models'
import type { LoadCartByUserIdRepo, LoadProductsByIdsRepo } from '@/interactions/contracts'
import { LoadCartUseCase } from './load-cart-usecase'
import { EmptyCartError, ProductNotAvailableError } from '@/domain/usecases-contracts/errors'
import type { CompleteCartModel } from '@/domain/models/complete-cart'
import { type CreateCartData, type CreateCart } from '@/domain/entities/contracts'

const makeFakeCartModel = (): CartModel => ({
  id: 'any_id',
  userId: 'any_user_id',
  products: [{
    id: 'any_product_id_1',
    quantity: 1
  }, {
    id: 'any_product_id_2',
    quantity: 2
  }, {
    id: 'any_product_id_3',
    quantity: 3
  }]
})

const makeFakeProducts = (): ProductModel[] => [{
  id: 'any_product_id_1',
  name: 'any name',
  amount: 10.90,
  description: 'any description'
}, {
  id: 'any_product_id_2',
  name: 'any name 2',
  amount: 20.90,
  description: 'another description'
}, {
  id: 'any_product_id_3',
  name: 'any name 3',
  amount: 32.99,
  description: 'another description'
}]

const makeFakeCartWithTotalModel = (): CompleteCartModel => ({
  total: 151.67,
  products: [{
    id: 'any_product_id_1',
    name: 'any name',
    amount: 10.90,
    quantity: 1
  }, {
    id: 'any_product_id_2',
    name: 'any name 2',
    amount: 20.90,
    quantity: 2
  }, {
    id: 'any_product_id_3',
    name: 'any name 3',
    amount: 32.99,
    quantity: 3
  }]
})

const makeLoadCartByUserIdRepo = (): LoadCartByUserIdRepo => {
  class LoadCartByUserIdRepoStub implements LoadCartByUserIdRepo {
    async loadByUserId (userId: string): Promise<null | CartModel> {
      return await Promise.resolve(makeFakeCartModel())
    }
  }
  return new LoadCartByUserIdRepoStub()
}

const makeLoadProductsByIdsRepo = (): LoadProductsByIdsRepo => {
  class LoadProductsByIdsRepoStub implements LoadProductsByIdsRepo {
    async loadProductsByIds (productIds: string[]): Promise<ProductModel[]> {
      return await Promise.resolve(makeFakeProducts())
    }
  }
  return new LoadProductsByIdsRepoStub()
}

const makeCreateCartStub = (): CreateCart => {
  class CreateCartStub implements CreateCart {
    create (data: CreateCartData): CompleteCartModel {
      return makeFakeCartWithTotalModel()
    }
  }
  return new CreateCartStub()
}

type SutTypes = {
  sut: LoadCartUseCase
  loadCartByUserIdRepoStub: LoadCartByUserIdRepo
  loadProductsByIdsRepoStub: LoadProductsByIdsRepo
  createCartStub: CreateCart
}

const makeSut = (): SutTypes => {
  const loadCartByUserIdRepoStub = makeLoadCartByUserIdRepo()
  const loadProductsByIdsRepoStub = makeLoadProductsByIdsRepo()
  const createCartStub = makeCreateCartStub()
  const sut = new LoadCartUseCase(loadCartByUserIdRepoStub, loadProductsByIdsRepoStub, createCartStub)
  return {
    sut,
    loadCartByUserIdRepoStub,
    loadProductsByIdsRepoStub,
    createCartStub
  }
}

describe('LoadCart UseCase', () => {
  it('Should call LoadCartByUserIdRepo with correct user id', async () => {
    const { sut, loadCartByUserIdRepoStub } = makeSut()
    const loadByUserIdSpy = jest.spyOn(loadCartByUserIdRepoStub, 'loadByUserId')
    await sut.perform('any_user_id')
    expect(loadByUserIdSpy).toHaveBeenCalledWith('any_user_id')
  })

  it('Should return EmptyCartError if LoadCartByUserIdRepo returns null', async () => {
    const { sut, loadCartByUserIdRepoStub } = makeSut()
    jest.spyOn(loadCartByUserIdRepoStub, 'loadByUserId').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.perform('any_user_id')
    expect(result.value).toEqual(new EmptyCartError())
  })

  it('Should return EmptyCartError if LoadCartByUserIdRepo returns an empty product list', async () => {
    const { sut, loadCartByUserIdRepoStub } = makeSut()
    jest.spyOn(loadCartByUserIdRepoStub, 'loadByUserId').mockReturnValueOnce(
      Promise.resolve({
        id: 'any_id',
        userId: 'any_user_id',
        products: []
      })
    )
    const result = await sut.perform('any_user_id')
    expect(result.value).toEqual(new EmptyCartError())
  })

  it('Should throw if LoadCartByUserIdRepo throws', async () => {
    const { sut, loadCartByUserIdRepoStub } = makeSut()
    jest.spyOn(loadCartByUserIdRepoStub, 'loadByUserId').mockImplementation(() => {
      throw new Error()
    })
    const promise = sut.perform('any_user_id')
    await expect(promise).rejects.toThrow()
  })

  it('Should call LoadProductsByIdsRepo with correct product ids', async () => {
    const { sut, loadProductsByIdsRepoStub } = makeSut()
    const loadByUserIdSpy = jest.spyOn(loadProductsByIdsRepoStub, 'loadProductsByIds')
    await sut.perform('any_user_id')
    expect(loadByUserIdSpy).toHaveBeenCalledWith(['any_product_id_1', 'any_product_id_2', 'any_product_id_3'])
  })

  it('Should return ProductNotAvailableError if LoadProductsByIdsRepo returns empty', async () => {
    const { sut, loadProductsByIdsRepoStub } = makeSut()
    jest.spyOn(loadProductsByIdsRepoStub, 'loadProductsByIds').mockReturnValueOnce(
      Promise.resolve([])
    )
    const result = await sut.perform('any_user_id')
    expect(result.value).toEqual(new ProductNotAvailableError('any_product_id_1'))
  })

  it('Should return ProductNotAvailableError if LoadProductsByIdsRepo can\'t find one of the products', async () => {
    const { sut, loadProductsByIdsRepoStub } = makeSut()
    jest.spyOn(loadProductsByIdsRepoStub, 'loadProductsByIds').mockReturnValueOnce(
      Promise.resolve([{
        id: 'any_product_id_1',
        name: 'any name',
        amount: 10.90,
        description: 'any description'
      }, {
        id: 'any_product_id_3',
        name: 'any name 3',
        amount: 32.99,
        description: 'another description'
      }])
    )
    const result = await sut.perform('any_user_id')
    expect(result.value).toEqual(new ProductNotAvailableError('any_product_id_2'))
  })

  it('Should throw if LoadProductsByIdsRepo throws', async () => {
    const { sut, loadProductsByIdsRepoStub } = makeSut()
    jest.spyOn(loadProductsByIdsRepoStub, 'loadProductsByIds').mockImplementation(() => {
      throw new Error()
    })
    const promise = sut.perform('any_user_id')
    await expect(promise).rejects.toThrow()
  })

  it('Should call CreateCart with correct values', async () => {
    const { sut, createCartStub } = makeSut()
    const createSpy = jest.spyOn(createCartStub, 'create')
    await sut.perform('any_user_id')
    expect(createSpy).toHaveBeenCalledWith({
      cartModel: makeFakeCartModel(),
      products: makeFakeProducts()
    })
  })

  it('Should return CartWithTotalModel if LoadProductsByIdsRepo is a success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform('any_user_id')
    expect(result.value).toEqual(makeFakeCartWithTotalModel())
  })
})
