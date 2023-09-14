import type { CompleteCartModel } from '@/domain/models'
import type { CheckoutResponseValue } from '@/domain/usecases-contracts'
import type { CheckoutGateway } from '@/interactions/contracts'
import { StripeHelper } from './helpers/stripe-helper'
import env from '@/main/config/env'

export class StripeAdapter implements CheckoutGateway {
  async payment (data: CompleteCartModel): Promise<null | CheckoutResponseValue> {
    const stripe = await StripeHelper.getInstance()
    const lineItems = data.products.map((product) => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: product.name
        },
        unit_amount: product.amount * 100
      },
      quantity: product.quantity
    }))
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: env.clientStripeSuccessUrl,
      cancel_url: env.clientStripeCancelUrl
    })
    return session.url ? { url: session.url } : null
  }
}