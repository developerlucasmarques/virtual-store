import type { CompleteCartModel, UserModel } from '@/domain/models'
import type { CheckoutResponseValue, LoadCart, LoadCartResponse } from '@/domain/usecases-contracts'
import { CheckoutFailureError } from '@/domain/usecases-contracts/errors'
import type { CheckoutGateway, CheckoutGatewayResponse, LoadUserByIdRepo } from '@/interactions/contracts'
import { left, right } from '@/shared/either'
import { CheckoutUseCase } from './checkout-usecase'

const makeFakeCompleteCartModel = (): CompleteCartModel => ({
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

const makeFakeUserModel = (): UserModel => ({
  id: 'any_id',
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  role: 'customer',
  accessToken: 'any_token'
})

const makeCheckoutResponseValue = (): CheckoutResponseValue => ({
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

const makeCheckoutGatewayStub = (): CheckoutGateway => {
  class CheckoutGatewayStub implements CheckoutGateway {
    async payment (data: CompleteCartModel): Promise<CheckoutGatewayResponse> {
      return await Promise.resolve(makeCheckoutResponseValue())
    }
  }
  return new CheckoutGatewayStub()
}

type SutTypes = {
  sut: CheckoutUseCase
  loadCartStub: LoadCart
  loadUserByIdRepoStub: LoadUserByIdRepo
  checkoutGatewayStub: CheckoutGateway
}

const makeSut = (): SutTypes => {
  const loadCartStub = makeLoadCartStub()
  const checkoutGatewayStub = makeCheckoutGatewayStub()
  const loadUserByIdRepoStub = makeLoadUserByIdRepo()
  const sut = new CheckoutUseCase(loadCartStub, loadUserByIdRepoStub, checkoutGatewayStub)
  return {
    sut,
    loadCartStub,
    loadUserByIdRepoStub,
    checkoutGatewayStub
  }
}

describe('Checkout UseCase', () => {
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

  test('Should call LoadUsertById with correct user id', async () => {
    const { sut, loadUserByIdRepoStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadUserByIdRepoStub, 'loadById')
    await sut.perform('any_user_id')
    expect(loadByIdSpy).toBeCalledWith('any_user_id')
  })

  it('Should call LoadUsertById only once', async () => {
    const { sut, loadUserByIdRepoStub } = makeSut()
    const performSpy = jest.spyOn(loadUserByIdRepoStub, 'loadById')
    await sut.perform('any_user_id')
    expect(performSpy).toHaveBeenCalledTimes(1)
  })

  it('Should throw if LoadUsertById throws', async () => {
    const { sut, loadUserByIdRepoStub } = makeSut()
    jest.spyOn(loadUserByIdRepoStub, 'loadById').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform('any_user_id')
    await expect(promise).rejects.toThrow()
  })

  it('Should call CheckoutGateway with correct values', async () => {
    const { sut, checkoutGatewayStub } = makeSut()
    const paymentSpy = jest.spyOn(checkoutGatewayStub, 'payment')
    await sut.perform('any_user_id')
    expect(paymentSpy).toHaveBeenCalledWith({
      ...makeFakeCompleteCartModel(),
      email: 'any_email@mail.com'
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
    expect(result.value).toEqual(makeCheckoutResponseValue())
  })
})
