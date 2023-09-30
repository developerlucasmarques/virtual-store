import { MongoHelper } from '@/external/db/mongo-db/helpers/mongo-helper'
import { StripeHelper } from '@/external/gateway/stripe/helpers/stripe-helper'
import { ObjectId, type Collection } from 'mongodb'
import type Stripe from 'stripe'
import request from 'supertest'
import app from '../config/app'
import env from '../config/env'

let productCollection: Collection
let userCollection: Collection
let orderCollection: Collection

const userObjectId = new ObjectId()
const userIdString = userObjectId.toHexString()
const orderObjectId = new ObjectId()
const orderIdString = orderObjectId.toHexString()
const productObjectId = new ObjectId()

const makeFakeProduct = (): any => ({
  _id: productObjectId,
  name: 'any_product_name',
  amount: 20.99,
  description: 'any_description'
})

const makeFakeOrder = (): any => ({
  _id: orderObjectId,
  userId: userIdString,
  orderCode: 'any_order_code',
  paymentStatus: 'Payment_Not_Started',
  status: 'Incomplete',
  createdAt: new Date(),
  updatedAt: new Date(),
  products: []
})

type PayloadStripe = {
  id: string
  object: string
  data: {
    object: {
      customer: string
    }
  }
  type: string
}

const makeFakePayload = async (gateway: Stripe): Promise<PayloadStripe> => {
  const customer = await gateway.customers.create({
    email: 'any_email@mail.com',
    metadata: {
      userId: userIdString,
      orderId: orderIdString
    }
  })
  const payload = {
    id: 'any_event_id',
    object: 'event',
    data: {
      object: {
        customer: customer.id
      }
    },
    type: 'checkout.session.completed'
  }
  return payload
}

describe('TransactionManager Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    productCollection = await MongoHelper.getCollection('product')
    userCollection = await MongoHelper.getCollection('user')
    orderCollection = await MongoHelper.getCollection('order')
    await productCollection.deleteMany({})
    await userCollection.deleteMany({})
    await orderCollection.deleteMany({})
  })

  it('Should return 200 if the transaction events are a success', async () => {
    userCollection = await MongoHelper.getCollection('user')
    await userCollection.insertOne({
      _id: userObjectId,
      name: 'any name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    await productCollection.insertOne(makeFakeProduct())
    await orderCollection.insertOne(makeFakeOrder())
    const stripe = await StripeHelper.getInstance()
    const payload = await makeFakePayload(stripe)
    const secret = env.webhookScret
    const payloadString = JSON.stringify(payload, null, 2)
    const signature = stripe.webhooks.generateTestHeaderString({ payload: payloadString, secret })
    await request(app)
      .post('/api/webhook')
      .set('stripe-signature', signature)
      .send({ payload })
      .expect(200)
  })
})
