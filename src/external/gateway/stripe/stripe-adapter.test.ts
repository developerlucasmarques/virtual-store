import type { CompleteCartModel } from '@/domain/models'
import { StripeAdapter } from './stripe-adapter'

jest.mock('stripe', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        checkout: {
          sessions: {
            create: jest.fn(async () => await Promise.resolve({
              url: 'https://checkout.stripe.com/c/pay/cs_test_any_token'
            }))
          }
        }
      }
    })
  }
})

const makeFakeCompleteCartModel = (): CompleteCartModel => ({
  total: 10.90,
  products: [{
    id: 'any_product_id_1',
    name: 'any name',
    amount: 10.90,
    quantity: 1
  }]
})

const makeSut = (): StripeAdapter => {
  return new StripeAdapter()
}

describe('Stripe Adapter', () => {
  it('Should returns session url on success', async () => {
    const sut = makeSut()
    const result = await sut.payment(makeFakeCompleteCartModel())
    expect(result).toEqual({ url: 'https://checkout.stripe.com/c/pay/cs_test_any_token' })
  })
})
