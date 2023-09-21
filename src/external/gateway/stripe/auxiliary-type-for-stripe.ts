import type Stripe from 'stripe'

export interface CustomCustomer extends Stripe.Customer {
  metadata: {
    purchaseIntentId: string
    userId: string
  }
}
