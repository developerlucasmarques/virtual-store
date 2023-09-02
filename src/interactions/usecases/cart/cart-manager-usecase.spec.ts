import type { AddProductToCart, AddProductToCartData, AddProductToCartResponse, CreateCart, CreateCartReponse } from '@/domain/usecases-contracts'
import { InvalidProductQuantityError, ProductNotFoundError } from '@/domain/usecases-contracts/errors'
import type { LoadCartByUserIdRepo, LoadCartByUserIdRepoResponse } from '@/interactions/contracts'
import { CartManagerUseCase } from './cart-manager-usecase'
import { left, right } from '@/shared/either'

const makeFakeAddProductToCartData = (): AddProductToCartData => ({
  userId: 'any_user_id',
  productId: 'any_product_id',
  productQty: 2
})

const makeFakeLoadCartByUserIdRepoResponse = (): LoadCartByUserIdRepoResponse => ({
  id: 'any_id',
  userId: 'any_user_id',
  productIds: ['any_product_id_1', 'any_product_id_2']
})

const makeLoadCartByUserIdRepo = (): LoadCartByUserIdRepo => {
  class LoadCartByUserIdRepoStub implements LoadCartByUserIdRepo {
    async loadByUserId (userId: string): Promise<null | LoadCartByUserIdRepoResponse> {
      return await Promise.resolve(makeFakeLoadCartByUserIdRepoResponse())
    }
  }
  return new LoadCartByUserIdRepoStub()
}

const makeCreateCart = (): CreateCart => {
  class CreateCartStub implements CreateCart {
    async perform (data: AddProductToCartData): Promise<CreateCartReponse> {
      return await Promise.resolve(right(null))
    }
  }
  return new CreateCartStub()
}

const makeAddProductToCart = (): AddProductToCart => {
  class AddProductToCartStub implements AddProductToCart {
    async perform (data: AddProductToCartData): Promise<AddProductToCartResponse> {
      return await Promise.resolve(right(null))
    }
  }
  return new AddProductToCartStub()
}

type SutTypes = {
  sut: CartManagerUseCase
  loadCartByUserIdRepoStub: LoadCartByUserIdRepo
  createCartStub: CreateCart
  addProductToCartStub: AddProductToCart
}

const makeSut = (): SutTypes => {
  const loadCartByUserIdRepoStub = makeLoadCartByUserIdRepo()
  const createCartStub = makeCreateCart()
  const addProductToCartStub = makeAddProductToCart()
  const sut = new CartManagerUseCase(loadCartByUserIdRepoStub, createCartStub, addProductToCartStub)
  return {
    sut,
    loadCartByUserIdRepoStub,
    createCartStub,
    addProductToCartStub
  }
}

describe('CartManager UseCase', () => {
  it('Should return InvalidProductQuantityError if productQty the less than 1', async () => {
    const { sut } = makeSut()
    const result = await sut.perform({
      userId: 'any_user_id',
      productId: 'any_product_id',
      productQty: 0
    })
    expect(result.value).toEqual(new InvalidProductQuantityError())
  })

  it('Should call LoadCartByUserIdRepo whith corret user id', async () => {
    const { sut, loadCartByUserIdRepoStub } = makeSut()
    const loadByUserIdSpy = jest.spyOn(loadCartByUserIdRepoStub, 'loadByUserId')
    await sut.perform(makeFakeAddProductToCartData())
    expect(loadByUserIdSpy).toHaveBeenCalledWith('any_user_id')
  })

  it('Should call CreateCart with correct values if LoadCartByUserIdRepo returns null', async () => {
    const { sut, loadCartByUserIdRepoStub, createCartStub } = makeSut()
    jest.spyOn(loadCartByUserIdRepoStub, 'loadByUserId').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const performSpy = jest.spyOn(createCartStub, 'perform')
    await sut.perform(makeFakeAddProductToCartData())
    expect(performSpy).toHaveBeenCalledWith(makeFakeAddProductToCartData())
  })

  it('Should return ProductNotFoundError if CreateCart returns this same error', async () => {
    const { sut, loadCartByUserIdRepoStub, createCartStub } = makeSut()
    jest.spyOn(loadCartByUserIdRepoStub, 'loadByUserId').mockReturnValueOnce(
      Promise.resolve(null)
    )
    jest.spyOn(createCartStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new ProductNotFoundError('any_product_id')))
    )
    const result = await sut.perform(makeFakeAddProductToCartData())
    expect(result.value).toEqual(new ProductNotFoundError('any_product_id'))
  })

  it('Should call AddProductToCart with correct values if LoadCartByUserIdRepo returns an cart', async () => {
    const { sut, addProductToCartStub } = makeSut()
    const performSpy = jest.spyOn(addProductToCartStub, 'perform')
    await sut.perform(makeFakeAddProductToCartData())
    expect(performSpy).toHaveBeenCalledWith(makeFakeAddProductToCartData())
  })
})
