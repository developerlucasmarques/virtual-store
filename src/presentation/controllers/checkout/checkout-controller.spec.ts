import type { Checkout, CheckoutResponse, CheckoutResponseValue } from '@/domain/usecases-contracts'
import type { HttpRequest } from '@/presentation/http-types/http'
import { right } from '@/shared/either'
import { CheckoutController } from './checkout-controller'

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    userId: 'any_user_id'
  }
})

const makeFakeCheckoutResponseValue = (): CheckoutResponseValue => ({
  value: 'any_value'
})

const makeCheckout = (): Checkout => {
  class CheckoutStub implements Checkout {
    async perform (userId: string): Promise<CheckoutResponse> {
      return await Promise.resolve(right(makeFakeCheckoutResponseValue()))
    }
  }
  return new CheckoutStub()
}

type SutTypes = {
  sut: CheckoutController
  checkoutStub: Checkout
}

const makeSut = (): SutTypes => {
  const checkoutStub = makeCheckout()
  const sut = new CheckoutController(checkoutStub)
  return {
    sut,
    checkoutStub
  }
}

describe('Checkout Controller', () => {
  it('Should call Checkout with correct user id', async () => {
    const { sut, checkoutStub } = makeSut()
    const performSpy = jest.spyOn(checkoutStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledWith('any_user_id')
  })

  it('Should call Checkout only once', async () => {
    const { sut, checkoutStub } = makeSut()
    const performSpy = jest.spyOn(checkoutStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledTimes(1)
  })
})
