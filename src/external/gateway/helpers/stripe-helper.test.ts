import Stripe from 'stripe'
import { StripeHelper as sut } from './stripe-helper'
import env from '@/main/config/env'

describe('Stripe Helper', () => {
  it('Should connect with Stripe', async () => {
    await sut.connect(env.stripeKey)
    expect(sut.client).toBeInstanceOf(Stripe)
  })

  it('Should throw if key not provided in connection', async () => {
    const promise = sut.connect('')
    await expect(promise).rejects.toThrow()
  })

  it('Should return Stripe instance if getInstance is a success', async () => {
    await sut.connect(env.stripeKey)
    const instance = sut.getInstance()
    expect(instance).toBeInstanceOf(Stripe)
  })
})
