import type { CheckoutGatewayData, TransactionListenerGatewayData } from '@/interactions/contracts'
import { StripeAdapter } from './stripe-adapter'

jest.mock('stripe', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        customers: {
          retrieve: jest.fn(async () => await Promise.resolve({
            id: 'any_customer_id',
            metadata: {
              userId: 'any_user_id',
              orderId: 'any_order_id'
            }
          })),
          create: jest.fn(async () => await Promise.resolve({
            id: 'any_customer_id',
            email: 'user_email@mail.com',
            metadata: {
              userId: 'any_user_id'
            }
          }))
        },
        checkout: {
          sessions: {
            create: jest.fn(async () => await Promise.resolve({
              url: 'https://checkout.stripe.com/c/pay/cs_test_any_token'
            }))
          }
        },
        webhooks: {
          constructEvent: jest.fn(() => ({
            data: {
              object: {
                metadata: {
                  userId: 'any_user_id',
                  orderId: 'any_order_id'
                }
              }
            },
            type: 'checkout.session.completed'
          }))
        }
      }
    })
  }
})

const makeFakeCheckoutGatewayData = (): CheckoutGatewayData => ({
  userEmail: 'any_email@mail.com',
  userId: 'any_user_id',
  orderId: 'any_order_id',
  total: 10.90,
  products: [{
    id: 'any_product_id_1',
    name: 'any name',
    amount: 10.90,
    quantity: 1
  }]
})

const makeFakeTransactionListenerGatewayData = (): TransactionListenerGatewayData => ({
  signature: 'any_signature',
  payload: 'any_payload'
})

const webhookSecret = 'any_secret'

const makeSut = (): StripeAdapter => {
  return new StripeAdapter(webhookSecret)
}

describe('Stripe Adapter', () => {
  describe('payment()', () => {
    it('Should return CheckoutGatewayResponse on success', async () => {
      const sut = makeSut()
      const result = await sut.payment(makeFakeCheckoutGatewayData())
      expect(result).toEqual({
        url: 'https://checkout.stripe.com/c/pay/cs_test_any_token'
      })
    })
  })

  describe('listener()', () => {
    it('Should return TransactionListenerGatewayResponse on success', async () => {
      const sut = makeSut()
      const result = await sut.listener(makeFakeTransactionListenerGatewayData())
      expect(result.value).toEqual({
        eventType: 'CheckoutCompleted',
        userId: 'any_user_id',
        orderId: 'any_order_id'
      })
    })
  })
})
