import Stripe from 'stripe'
import env from '@/main/config/env'

export const StripeHelper = {
  client: null as unknown as Stripe | null,

  async connect (key: string | undefined): Promise<void> {
    if (!key) {
      this.client = new Stripe(env.stripeKey, { apiVersion: '2023-08-16' })
      if (!(this.client instanceof Stripe)) {
        throw new Error('Stripe key is required')
      }
      return
    }
    this.client = new Stripe(key, { apiVersion: '2023-08-16' })
  },

  async getInstance (): Promise<Stripe> {
    if (!this.client) {
      await this.connect(env.stripeKey)
    }
    return this.client as Stripe
  },

  disconnect (): void {
    this.client = null
  }
}
