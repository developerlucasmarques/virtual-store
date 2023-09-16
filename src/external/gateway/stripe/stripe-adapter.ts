import type { CheckoutGateway, CheckoutGatewayData, CheckoutGatewayResponse } from '@/interactions/contracts'
import env from '@/main/config/env'
import type Stripe from 'stripe'
import { StripeHelper } from './helpers/stripe-helper'

export class StripeAdapter implements CheckoutGateway {
  async payment (data: CheckoutGatewayData): Promise<null | CheckoutGatewayResponse> {
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
      cancel_url: env.clientStripeCancelUrl,
      phone_number_collection: {
        enabled: true
      }
    })
    if (session.url && customer.id) {
      return { url: session.url, gatewayCustomerId: customer.id }
    }
    return null
  }
}
