import type { Checkout, CheckoutResponse, CheckoutResponseValue } from '@/domain/usecases-contracts'
import type { HttpRequest } from '@/presentation/http-types/http'
import { left, right } from '@/shared/either'
import { CheckoutController } from './checkout-controller'
import { ProductNotAvailableError } from '@/domain/usecases-contracts/errors'
import { notFound } from '@/presentation/helpers/http/http-helpers'

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

  it('Should return 404 if Checkout returns ProductNotAvailableError', async () => {
    const { sut, checkoutStub } = makeSut()
    jest.spyOn(checkoutStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new ProductNotAvailableError('any_product_id')))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(notFound(new ProductNotAvailableError('any_product_id')))
  })
})
