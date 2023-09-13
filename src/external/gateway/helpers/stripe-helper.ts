import Stripe from 'stripe'

export const StripeHelper = {
  client: null as unknown as Stripe | null,

  async connect (key: string | undefined): Promise<void> {
    if (!key) {
      throw new Error('Stripe key is required')
    }
    this.client = new Stripe(key, { apiVersion: '2023-08-16' })
  },

  getInstance (): Stripe {
    if (!this.client) {
      throw new Error('There is instance of Stripe')
    }
    return this.client
  }
}
