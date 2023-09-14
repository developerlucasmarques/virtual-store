import type { CheckoutResponseValue } from '@/domain/usecases-contracts'
import type { CheckoutGateway, CheckoutGatewayData } from '@/interactions/contracts'
import env from '@/main/config/env'
import { StripeHelper } from './helpers/stripe-helper'
import type Stripe from 'stripe'

export class StripeAdapter implements CheckoutGateway {
  async payment (data: CheckoutGatewayData): Promise<null | CheckoutResponseValue> {
    const stripe = await StripeHelper.getInstance()
    const customer = await stripe.customers.create({
      email: data.userEmail,
      metadata: {
        userId: data.userId
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
      cancel_url: env.clientStripeCancelUrl
    })
    return session.url ? { url: session.url } : null
  }
}
