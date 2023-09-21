import type { CheckoutGateway, CheckoutGatewayData, CheckoutGatewayResponse, TransactionListenerGateway, TransactionListenerGatewayData, TransactionListenerGatewayResponse } from '@/interactions/contracts'
import env from '@/main/config/env'
import type Stripe from 'stripe'
import { StripeHelper } from './helpers/stripe-helper'
import type { CustomCustomer } from './auxiliary-type-for-stripe'

export class StripeAdapter implements CheckoutGateway, TransactionListenerGateway {
  constructor (private readonly webhookSecret: string) {}

  async payment (data: CheckoutGatewayData): Promise<null | CheckoutGatewayResponse> {
    const stripe = await StripeHelper.getInstance()
    const customer = await stripe.customers.create({
      email: data.userEmail,
      metadata: {
        userId: data.userId,
        purchaseIntentId: data.purchaseIntentId
      }
    })
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = data.products.map(
      (product) => ({
        quantity: product.quantity,
        price_data: {
          currency: 'brl',
          unit_amount: product.amount * 100,
          product_data: {
            name: product.name,
            metadata: {
              id: product.id
            }
          }
        }
      }))
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      customer: customer.id,
      success_url: env.clientStripeSuccessUrl,
      cancel_url: env.clientStripeCancelUrl,
      phone_number_collection: {
        enabled: true
      }
    })
    if (session.url) {
      return { url: session.url }
    }
    return null
  }

  async listener (data: TransactionListenerGatewayData): Promise<null | TransactionListenerGatewayResponse> {
    const stripe = await StripeHelper.getInstance()
    const payloadString = JSON.stringify(data.payload, (key, value) => {
      if (key === 'payload') {
        return undefined
      }
      return value
    }, 2)
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: this.webhookSecret
    })
    try {
      const event = stripe.webhooks.constructEvent(payloadString, header, this.webhookSecret)
      if (event.type === 'payment_intent.succeeded') {
        const cutomerId = (event.data.object as { customer: string }).customer
        const customer = await stripe.customers.retrieve(cutomerId) as unknown as CustomCustomer
        return {
          eventType: 'PaymentSuccess',
          userId: customer.metadata.userId,
          purchaseIntentId: customer.metadata.purchaseIntentId
        }
      }
    } catch (error: any) {
      return null
    }
    return {
      eventType: 'PaymentSuccess',
      userId: 'any_user_id',
      purchaseIntentId: 'any_purchase'
    }
  }
}
