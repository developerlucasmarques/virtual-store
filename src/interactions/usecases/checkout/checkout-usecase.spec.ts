import type { CompleteCartModel, OrderModel, UserModel } from '@/domain/models'
import type { AddOrder, AddOrderData, LoadCart, LoadCartResponse } from '@/domain/usecases-contracts'
import { CheckoutFailureError } from '@/domain/usecases-contracts/errors'
import type { CheckoutGateway, CheckoutGatewayResponse, LoadUserByIdRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'
import MockDate from 'mockdate'
import { CheckoutUseCase } from './checkout-usecase'

const products = [{
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

const makeFakeCompleteCartModel = (): CompleteCartModel => ({
  total: 151.67, products
})

const makeFakeUserModel = (): UserModel => ({
  id: 'any_user_id',
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  role: 'customer',
  accessToken: 'any_token'
})

const makeFakeOrderModel = (): OrderModel => ({
  id: 'any_order_id',
  userId: 'any_user_id',
  orderCode: 'any_order_code',
  paymentStatus: 'Payment_Pending',
  status: 'Processing',
  createdAt: new Date(),
  updatedAt: new Date(),
  products
})

const makeCheckoutGatewayResponse = (): CheckoutGatewayResponse => ({
  url: 'any_url'
})

const makeLoadCartStub = (): LoadCart => {
  class LoadCartStub implements LoadCart {
    async perform (userId: string): Promise<LoadCartResponse> {
      return await Promise.resolve(right(makeFakeCompleteCartModel()))
    }
  }
  return new LoadCartStub()
}

const makeLoadUserByIdRepo = (): LoadUserByIdRepo => {
  class LoadUserByIdRepoStub implements LoadUserByIdRepo {
    async loadById (id: string): Promise<null | UserModel> {
      return await Promise.resolve(makeFakeUserModel())
    }
  }
  return new LoadUserByIdRepoStub()
}

const makeAddOrder = (): AddOrder => {
  class AddOrderStub implements AddOrder {
    async perform (data: AddOrderData): Promise<OrderModel> {
      return await Promise.resolve(makeFakeOrderModel())
    }
  }
  return new AddOrderStub()
}

const makeCheckoutGatewayStub = (): CheckoutGateway => {
  class CheckoutGatewayStub implements CheckoutGateway {
    async payment (data: CompleteCartModel): Promise<CheckoutGatewayResponse> {
      return await Promise.resolve(makeCheckoutGatewayResponse())
    }
  }
  return new CheckoutGatewayStub()
}

type SutTypes = {
  sut: CheckoutUseCase
  loadCartStub: LoadCart
  loadUserByIdRepoStub: LoadUserByIdRepo
  addOrderStub: AddOrder
  checkoutGatewayStub: CheckoutGateway
}

const makeSut = (): SutTypes => {
  const loadCartStub = makeLoadCartStub()
  const loadUserByIdRepoStub = makeLoadUserByIdRepo()
  const addOrderStub = makeAddOrder()
  const checkoutGatewayStub = makeCheckoutGatewayStub()
  const sut = new CheckoutUseCase(
    loadCartStub, loadUserByIdRepoStub, addOrderStub, checkoutGatewayStub
  )
  return {
    sut,
    loadCartStub,
    loadUserByIdRepoStub,
    addOrderStub,
    checkoutGatewayStub
  }
}

describe('Checkout UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadCart with correct user id', async () => {
    const { sut, loadCartStub } = makeSut()
    const performSpy = jest.spyOn(loadCartStub, 'perform')
    await sut.perform('any_user_id')
    expect(performSpy).toHaveBeenCalledWith('any_user_id')
  })

  it('Should return an error if LoadCart returns an error', async () => {
    const { sut, loadCartStub } = makeSut()
    jest.spyOn(loadCartStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const result = await sut.perform('any_user_id')
    expect(result.value).toEqual(new Error('any_message'))
  })

  it('Should call LoadCart only once', async () => {
    const { sut, loadCartStub } = makeSut()
    const performSpy = jest.spyOn(loadCartStub, 'perform')
    await sut.perform('any_user_id')
    expect(performSpy).toHaveBeenCalledTimes(1)
  })

  it('Should throw if LoadCart throws', async () => {
    const { sut, loadCartStub } = makeSut()
    jest.spyOn(loadCartStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform('any_user_id')
    await expect(promise).rejects.toThrow()
  })

  it('Should call LoadUsertById with correct user id', async () => {
    const { sut, loadUserByIdRepoStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadUserByIdRepoStub, 'loadById')
    await sut.perform('any_user_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_user_id')
  })

  it('Should call LoadUsertById only once', async () => {
    const { sut, loadUserByIdRepoStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadUserByIdRepoStub, 'loadById')
    await sut.perform('any_user_id')
    expect(loadByIdSpy).toHaveBeenCalledTimes(1)
  })

  it('Should throw if LoadUsertById throws', async () => {
    const { sut, loadUserByIdRepoStub } = makeSut()
    jest.spyOn(loadUserByIdRepoStub, 'loadById').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform('any_user_id')
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddOrder with correct values', async () => {
    const { sut, addOrderStub } = makeSut()
    const performSpy = jest.spyOn(addOrderStub, 'perform')
    await sut.perform('any_user_id')
    expect(performSpy).toHaveBeenCalledWith({
      userId: 'any_user_id',
      products,
      status: 'Incomplete',
      paymentStatus: 'Payment_Not_Started'
    })
  })

  it('Should call AddOrder only once', async () => {
    const { sut, addOrderStub } = makeSut()
    const performSpy = jest.spyOn(addOrderStub, 'perform')
    await sut.perform('any_user_id')
    expect(performSpy).toHaveBeenCalledTimes(1)
  })

  it('Should call CheckoutGateway with correct values', async () => {
    const { sut, checkoutGatewayStub } = makeSut()
    const paymentSpy = jest.spyOn(checkoutGatewayStub, 'payment')
    await sut.perform('any_user_id')
    expect(paymentSpy).toHaveBeenCalledWith({
      ...makeFakeCompleteCartModel(),
      userEmail: 'any_email@mail.com',
      userId: 'any_user_id',
      orderId: 'any_order_id'
    })
  })

  it('Should call CheckoutGateway only once', async () => {
    const { sut, checkoutGatewayStub } = makeSut()
    const paymentSpy = jest.spyOn(checkoutGatewayStub, 'payment')
    await sut.perform('any_user_id')
    expect(paymentSpy).toHaveBeenCalledTimes(1)
  })

  it('Should return CheckoutFailureError if CheckoutGateway returns null', async () => {
    const { sut, checkoutGatewayStub } = makeSut()
    jest.spyOn(checkoutGatewayStub, 'payment').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.perform('any_user_id')
    expect(result.value).toEqual(new CheckoutFailureError())
  })

  it('Should throw if CheckoutGateway throws', async () => {
    const { sut, checkoutGatewayStub } = makeSut()
    jest.spyOn(checkoutGatewayStub, 'payment').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform('any_user_id')
    await expect(promise).rejects.toThrow()
  })

  it('Should return CheckoutResponseValue if CheckoutGateway is a success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform('any_user_id')
    expect(result.value).toEqual({ url: 'any_url' })
  })
})
