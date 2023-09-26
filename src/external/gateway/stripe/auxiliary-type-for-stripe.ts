import type Stripe from 'stripe'

export interface CustomCustomer extends Stripe.Customer {
  metadata: {
    orderId: string
    userId: string
  }
}
