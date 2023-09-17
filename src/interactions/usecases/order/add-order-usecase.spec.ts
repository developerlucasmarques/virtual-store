import type { PurchaseIntentModel } from '@/domain/models'
import type { LoadPurchaseIntentByIdRepo } from '@/interactions/contracts'
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

type SutTypes = {
  sut: AddOrderUseCase
  loadPurchaseIntentByIdRepoStub: LoadPurchaseIntentByIdRepo
}

const makeSut = (): SutTypes => {
  const loadPurchaseIntentByIdRepoStub = makeLoadPurchaseIntentByIdRepo()
  const sut = new AddOrderUseCase(loadPurchaseIntentByIdRepoStub)
  return {
    sut,
    loadPurchaseIntentByIdRepoStub
  }
}

describe('AddOrder UseCase', () => {
  it('Should call LoadPurchaseIntentRepo with correct id', async () => {
    const { sut, loadPurchaseIntentByIdRepoStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadPurchaseIntentByIdRepoStub, 'loadById')
    await sut.perform(makeFakeAddOrderData())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_purchase_intent_id')
  })

  it('Should return PurchaseIntentNotFoundError if LoadPurchaseIntentRepo returns null', async () => {
    const { sut, loadPurchaseIntentByIdRepoStub } = makeSut()
    jest.spyOn(loadPurchaseIntentByIdRepoStub, 'loadById').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.perform(makeFakeAddOrderData())
    expect(result.value).toEqual(new PurchaseIntentNotFoundError('any_purchase_intent_id'))
  })
})
