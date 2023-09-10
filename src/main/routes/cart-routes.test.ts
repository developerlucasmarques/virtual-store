import { MongoHelper } from '@/external/db/mongo-db/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'
import { ObjectId, type Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let productCollection: Collection
let userCollection: Collection

const productObjectId = new ObjectId()
const productIdString = productObjectId.toHexString()
const userObjectId = new ObjectId()

describe('Cart Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    productCollection = await MongoHelper.getCollection('product')
    userCollection = await MongoHelper.getCollection('user')
    await productCollection.deleteMany({})
    await userCollection.deleteMany({})
  })

  describe('/cart', () => {
    it('Should return 204 on cart', async () => {
      const accessToken = sign({ id: userObjectId }, env.jwtSecretKey)
      await userCollection.insertOne({
        _id: userObjectId,
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      await productCollection.insertOne({
        _id: productObjectId,
        name: 'any_product_name',
        amount: 20.99,
        description: 'any_description'
      })
      await request(app)
        .post('/api/cart')
        .set('x-access-token', accessToken)
        .send({
          productId: productIdString,
          productQty: 2
        })
        .expect(204)
    })

    it('Should return 401 if user does not have an access token', async () => {
      await productCollection.insertOne({
        _id: productObjectId,
        name: 'any_product_name',
        amount: 20.99,
        description: 'any_description'
      })
      await request(app)
        .post('/api/cart')
        .send({
          productId: productIdString,
          productQty: 2
        })
        .expect(401)
    })
  })
})
