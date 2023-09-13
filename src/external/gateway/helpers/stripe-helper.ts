import Stripe from 'stripe'

export const StripeHelper = {
  client: null as unknown as Stripe | null,
  key: null as unknown as string,

  async connect (key: string | undefined): Promise<void> {
    if (!key) {
      this.key = 'any_key'
    } else {
      this.key = key
    }
    this.client = new Stripe(this.key, { apiVersion: '2023-08-16' })
  }
}
