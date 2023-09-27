import type { OrderModel } from '@/domain/models'
import type { AddOrderData, GenerateOrderCode, OrderCode } from '@/domain/usecases-contracts'
import type { AddOrderRepo, Id, IdBuilder } from '@/interactions/contracts'
import MockDate from 'mockdate'
import { AddOrderUseCase } from './add-order-usecase'

const makeFakeAddOrderData = (): AddOrderData => ({
  userId: 'any_user_id',
  status: 'Processing',
  paymentStatus: 'Payment_Pending',
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
  orderCode: 'any_order_code',
  paymentStatus: 'Payment_Pending',
  status: 'Processing',
  createdAt: new Date(),
  updatedAt: new Date(),
  products: [{
    id: 'any_product_id',
    name: 'any name',
    amount: 10.90,
    quantity: 1
  }]
})

const makeIdBuilder = (): IdBuilder => {
  class IdBuilderStub implements IdBuilder {
    build (): Id {
      return { id: 'any_order_id' }
    }
  }
  return new IdBuilderStub()
}

const makeGenerateOrderCode = (): GenerateOrderCode => {
  class GenerateOrderCodeStub implements GenerateOrderCode {
    async perform (userId: string): Promise<OrderCode> {
      return await Promise.resolve({ code: 'any_order_code' })
    }
  }
  return new GenerateOrderCodeStub()
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
  idBuilderStub: IdBuilder
  generateOrderCodeStub: GenerateOrderCode
  addOrderRepoStub: AddOrderRepo
}

const makeSut = (): SutTypes => {
  const idBuilderStub = makeIdBuilder()
  const generateOrderCodeStub = makeGenerateOrderCode()
  const addOrderRepoStub = makeAddOrderRepo()
  const sut = new AddOrderUseCase(
    idBuilderStub,
    generateOrderCodeStub,
    addOrderRepoStub
  )
  return {
    sut,
    idBuilderStub,
    generateOrderCodeStub,
    addOrderRepoStub
  }
}

describe('AddOrder UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
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
      throw new Error()
    })
    const promise = sut.perform(makeFakeAddOrderData())
    await expect(promise).rejects.toThrow()
  })

  it('Should call GenerateOrderCode with correct user id', async () => {
    const { sut, generateOrderCodeStub } = makeSut()
    const performSpy = jest.spyOn(generateOrderCodeStub, 'perform')
    await sut.perform(makeFakeAddOrderData())
    expect(performSpy).toHaveBeenCalledWith('any_user_id')
  })

  it('Should call GenerateOrderCode only once', async () => {
    const { sut, generateOrderCodeStub } = makeSut()
    const performSpy = jest.spyOn(generateOrderCodeStub, 'perform')
    await sut.perform(makeFakeAddOrderData())
    expect(performSpy).toHaveBeenCalledTimes(1)
  })

  it('Should throw if GenerateOrderCode throws', async () => {
    const { sut, generateOrderCodeStub } = makeSut()
    jest.spyOn(generateOrderCodeStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
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

  it('Should throw if AddOrderRepo throws', async () => {
    const { sut, addOrderRepoStub } = makeSut()
    jest.spyOn(addOrderRepoStub, 'add').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeAddOrderData())
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if AddOrderRepo is a success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform(makeFakeAddOrderData())
    expect(result).toEqual(makeFakeOrderModel())
  })
})
