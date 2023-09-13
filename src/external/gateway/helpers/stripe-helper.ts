import Stripe from 'stripe'

export const StripeHelper = {
  client: null as unknown as Stripe | null,

  async connect (key: string | undefined): Promise<void> {
    if (!key) {
      throw new Error('Stripe key is required')
    }
    this.client = new Stripe(key, { apiVersion: '2023-08-16' })
  }
}
