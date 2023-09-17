import type { OrderModel, PurchaseIntentModel } from '@/domain/models'
import type { AddOrderRepo, Id, IdBuilder, LoadPurchaseIntentByIdRepo } from '@/interactions/contracts'
import { AddOrderUseCase } from './add-order-usecase'
import type { AddOrderData } from '@/domain/usecases-contracts'
import { PurchaseIntentNotFoundError } from '@/domain/usecases-contracts/errors'

const makeFakeAddOrderData = (): AddOrderData => ({
  purchaseIntentId: 'any_purchase_intent_id',
  userId: 'any_user_id'
})

const makeFakePurchaseIntentModel = (): PurchaseIntentModel => ({
  id: 'any_purchase_intent_id',
  userId: 'any_user_id',
  createdAt: new Date(),
  updateDat: new Date(),
  status: 'pending',
  products: [{
    id: 'any_product_id',
    name: 'any name',
    amount: 10.90,
    quantity: 1
  }]
})

const makeFakeOrderModel = (): OrderModel => ({
  id: 'any_order_id',
  userId: 'any_user_id',
  products: [{
    id: 'any_product_id',
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

const makeAddOrderRepo = (): AddOrderRepo => {
  class AddOrderRepoStub implements AddOrderRepo {
    async add (data: OrderModel): Promise<void> {
      await Promise.resolve()
    }
  }
  return new AddOrderRepoStub()
}

type SutTypes = {
  sut: AddOrderUseCase
  loadPurchaseIntentByIdRepoStub: LoadPurchaseIntentByIdRepo
  idBuilderStub: IdBuilder
  addOrderRepoStub: AddOrderRepo
}

const makeSut = (): SutTypes => {
  const loadPurchaseIntentByIdRepoStub = makeLoadPurchaseIntentByIdRepo()
  const idBuilderStub = makeIdBuilder()
  const addOrderRepoStub = makeAddOrderRepo()
  const sut = new AddOrderUseCase(loadPurchaseIntentByIdRepoStub, idBuilderStub, addOrderRepoStub)
  return {
    sut,
    loadPurchaseIntentByIdRepoStub,
    idBuilderStub,
    addOrderRepoStub
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
    const loadByIdSpy = jest.spyOn(loadPurchaseIntentByIdRepoStub, 'loadById')
    await sut.perform(makeFakeAddOrderData())
    expect(loadByIdSpy).toHaveBeenCalledTimes(1)
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

  it('Should throw if IdBuilder throws', async () => {
    const { sut, idBuilderStub } = makeSut()
    jest.spyOn(idBuilderStub, 'build').mockImplementationOnce(() => {
      throw new Error('any_message')
    })
    const promise = sut.perform(makeFakeAddOrderData())
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddOrderRepo with correct values', async () => {
    const { sut, addOrderRepoStub } = makeSut()
    const addSpy = jest.spyOn(addOrderRepoStub, 'add')
    await sut.perform(makeFakeAddOrderData())
    expect(addSpy).toHaveBeenCalledWith(makeFakeOrderModel())
  })

  it('Should call AddOrderRepo only once', async () => {
    const { sut, addOrderRepoStub } = makeSut()
    const addSpy = jest.spyOn(addOrderRepoStub, 'add')
    await sut.perform(makeFakeAddOrderData())
    expect(addSpy).toHaveBeenCalledTimes(1)
  })
})
