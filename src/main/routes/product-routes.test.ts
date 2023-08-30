import { MongoHelper } from '@/external/db/mongo-db/helpers/mongo-helper'
import app from '@/main/config/app'
import env from '@/main/config/env'
import { sign } from 'jsonwebtoken'
import { ObjectId, type Collection } from 'mongodb'
import request from 'supertest'

let userCollection: Collection
let productCollection: Collection

describe('Product Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    productCollection = await MongoHelper.getCollection('product')
    await productCollection.deleteMany({})
    userCollection = await MongoHelper.getCollection('user')
    await userCollection.deleteMany({})
  })

  describe('POST /product', () => {
    it('Should return 401 on add product without x-access-token', async () => {
      await request(app)
        .post('/api/product')
        .send({
          name: 'any name',
          amount: 10.90,
          description: 'any_description'
        })
        .expect(401)
    })

    it('Should return 204 on add product with valid accessToken', async () => {
      const idString = new ObjectId().toHexString()
      const objectId = new ObjectId(idString)
      const accessToken = sign({ id: idString }, env.jwtSecretKey, { expiresIn: '24h' })
      const userModel = {
        _id: objectId,
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'abcd1234',
        role: 'admin',
        accessToken
      }
      await userCollection.insertOne(userModel)
      await request(app)
        .post('/api/product')
        .set('x-access-token', accessToken)
        .send({
          name: 'any name',
          amount: 10.90,
          description: 'any_description'
        })
        .expect(204)
    })
  })

  describe('GET /product', () => {
    it('Should return 204 on load products', async () => {
      await request(app)
        .get('/api/product')
        .expect(204)
    })
  })

  describe('GET /product/:productId', () => {
    it('Should return 200 on load product', async () => {
      const objectId = new ObjectId()
      const idString = objectId.toHexString()
      const productModel = {
        _id: objectId,
        name: 'any name',
        amount: 10.90,
        description: 'any description'
      }
      await productCollection.insertOne(productModel)

      await request(app)
        .get(`/api/product/${idString}`)
        .expect(200)
    })
  })
})
