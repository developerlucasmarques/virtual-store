import type { PurchaseIntentModel } from '@/domain/models'
import type { Id, IdBuilder, LoadPurchaseIntentByIdRepo } from '@/interactions/contracts'
import { AddOrderUseCase } from './add-order-usecase'
import type { AddOrderData } from '@/domain/usecases-contracts'
import { PurchaseIntentNotFoundError } from '@/domain/usecases-contracts/errors'

const makeFakeAddOrderData = (): AddOrderData => ({
  purchaseIntentId: 'any_purchase_intent_id'
})

const makeFakePurchaseIntentModel = (): PurchaseIntentModel => ({
  id: 'any_purchase_intent_id',
  userId: 'any_user_id',
  createdAt: new Date(),
  updateDat: new Date(),
  status: 'pending',
  products: [{
    id: 'any_product_id_1',
    name: 'any name',
    amount: 10.90,
    quantity: 1
  }]
})

const makeLoadPurchaseIntentByIdRepo = (): LoadPurchaseIntentByIdRepo => {
  class LoadPurchaseIntentByIdRepoStub implements LoadPurchaseIntentByIdRepo {
    async loadById (id: string): Promise<null | PurchaseIntentModel> {
      return await Promise.resolve(makeFakePurchaseIntentModel())
    }
  }
  return new LoadPurchaseIntentByIdRepoStub()
}

const makeIdBuilder = (): IdBuilder => {
  class IdBuilderStub implements IdBuilder {
    build (): Id {
      return { id: 'any_order_id' }
    }
  }
  return new IdBuilderStub()
}

type SutTypes = {
  sut: AddOrderUseCase
  loadPurchaseIntentByIdRepoStub: LoadPurchaseIntentByIdRepo
  idBuilderStub: IdBuilder
}

const makeSut = (): SutTypes => {
  const loadPurchaseIntentByIdRepoStub = makeLoadPurchaseIntentByIdRepo()
  const idBuilderStub = makeIdBuilder()
  const sut = new AddOrderUseCase(loadPurchaseIntentByIdRepoStub, idBuilderStub)
  return {
    sut,
    loadPurchaseIntentByIdRepoStub,
    idBuilderStub
  }
}

describe('AddOrder UseCase', () => {
  it('Should call LoadPurchaseIntentRepo with correct id', async () => {
    const { sut, loadPurchaseIntentByIdRepoStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadPurchaseIntentByIdRepoStub, 'loadById')
    await sut.perform(makeFakeAddOrderData())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_purchase_intent_id')
  })

  it('Should call LoadPurchaseIntentRepo only once', async () => {
    const { sut, loadPurchaseIntentByIdRepoStub } = makeSut()
    const performSpy = jest.spyOn(loadPurchaseIntentByIdRepoStub, 'loadById')
    await sut.perform(makeFakeAddOrderData())
    expect(performSpy).toHaveBeenCalledTimes(1)
  })

  it('Should return PurchaseIntentNotFoundError if LoadPurchaseIntentRepo returns null', async () => {
    const { sut, loadPurchaseIntentByIdRepoStub } = makeSut()
    jest.spyOn(loadPurchaseIntentByIdRepoStub, 'loadById').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.perform(makeFakeAddOrderData())
    expect(result.value).toEqual(new PurchaseIntentNotFoundError('any_purchase_intent_id'))
  })

  it('Should throw if LoadPurchaseIntentRepo throws', async () => {
    const { sut, loadPurchaseIntentByIdRepoStub } = makeSut()
    jest.spyOn(loadPurchaseIntentByIdRepoStub, 'loadById').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeAddOrderData())
    await expect(promise).rejects.toThrow()
  })

  it('Should call IdBuilder only once', async () => {
    const { sut, idBuilderStub } = makeSut()
    const buildSpy = jest.spyOn(idBuilderStub, 'build')
    await sut.perform(makeFakeAddOrderData())
    expect(buildSpy).toHaveBeenCalledTimes(1)
  })
})
