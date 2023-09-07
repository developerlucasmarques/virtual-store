import type { ProductModel } from '@/domain/models'
import type { LoadProductByIdRepo } from '@/interactions/contracts'
import { AddProductToCartUseCase } from './add-product-to-cart-usecese'

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
  sut: AddProductToCartUseCase
  loadProductByIdRepoStub: LoadProductByIdRepo
}

const makeSut = (): SutTypes => {
  const loadProductByIdRepoStub = makeLoadProductByIdRepo()
  const sut = new AddProductToCartUseCase(loadProductByIdRepoStub)
  return {
    sut,
    loadProductByIdRepoStub
  }
}

describe('AddProductToCart UseCase', () => {
  it('Should call LoadProductByIdRepo with correct product id', async () => {
    const { sut, loadProductByIdRepoStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadProductByIdRepoStub, 'loadById')
    await sut.perform({
      userId: 'any_user_id',
      productId: 'any_product_id',
      productQty: 1
    })
    expect(loadByIdSpy).toHaveBeenCalledWith('any_product_id')
  })
})
