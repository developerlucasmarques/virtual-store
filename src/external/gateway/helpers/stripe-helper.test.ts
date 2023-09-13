import env from '@/main/config/env'
import Stripe from 'stripe'
import { StripeHelper as sut } from './stripe-helper'

jest.mock('stripe')

describe('Stripe Helper', () => {
  beforeEach(() => {
    sut.disconnect()
  })

  it('Should connect with Stripe', async () => {
    await sut.connect(env.stripeKey)
    expect(sut.client).toBeInstanceOf(Stripe)
  })

  it('Should call Stripe', async () => {
    await sut.connect(env.stripeKey)
    expect(Stripe).toBeCalled()
  })

  it('Should reconnect if key not provided in connection', async () => {
    await sut.connect('')
    expect(sut.client).toBeInstanceOf(Stripe)
  })

  it('Should return Stripe instance if getInstance is a success', async () => {
    await sut.connect(env.stripeKey)
    const instance = await sut.getInstance()
    expect(instance).toBeInstanceOf(Stripe)
  })

  it('Should disconnect', async () => {
    await sut.connect('')
    sut.disconnect()
    expect(sut.client).toBeNull()
  })
})
