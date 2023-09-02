import type { AddProductToCartData, CreateCart } from '@/domain/usecases-contracts'
import type { Id, IdBuilder } from '@/interactions/contracts'
import { CreateCartUseCase } from './create-cart-usecase'

const makeFakeAddProductToCartData = (): AddProductToCartData => ({
  userId: 'any_user_id',
  productId: 'any_product_id',
  productQty: 2
})

type SutTypes = {
  sut: CreateCart
  idBuilderStub: IdBuilder
}

const makeIdBuilder = (): IdBuilder => {
  class IdBuilderStub implements IdBuilder {
    build (): Id {
      return { id: 'any_id' }
    }
  }
  return new IdBuilderStub()
}

const makeSut = (): SutTypes => {
  const idBuilderStub = makeIdBuilder()
  const sut = new CreateCartUseCase(idBuilderStub)
  return {
    sut,
    idBuilderStub
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
})
