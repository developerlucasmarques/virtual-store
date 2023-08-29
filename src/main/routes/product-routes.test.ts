import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '@/external/db/mongo-db/helpers/mongo-helper'
import { ObjectId, type Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'

let userCollection: Collection

describe('Product Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    userCollection = await MongoHelper.getCollection('user')
    await userCollection.deleteMany({})
  })

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
