import type { AddProductToCartData, CreateCart, CreateCartReponse } from '@/domain/usecases-contracts'
import { InvalidProductQuantityError } from '@/domain/usecases-contracts/errors'
import type { LoadCartByUserIdRepo, LoadCartByUserIdRepoResponse } from '@/interactions/contracts'
import { CartManagerUseCase } from './cart-manager-usecase'
import { right } from '@/shared/either'

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

type SutTypes = {
  sut: CartManagerUseCase
  loadCartByUserIdRepoStub: LoadCartByUserIdRepo
  createCartStub: CreateCart
}

const makeSut = (): SutTypes => {
  const loadCartByUserIdRepoStub = makeLoadCartByUserIdRepo()
  const createCartStub = makeCreateCart()
  const sut = new CartManagerUseCase(loadCartByUserIdRepoStub, createCartStub)
  return {
    sut,
    loadCartByUserIdRepoStub,
    createCartStub
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
})
