import request from 'supertest'
import app from '../config/app'
import { type Collection } from 'mongodb'
import { MongoHelper } from '@/external/db/mongo-db/helpers/mongo-helper'

let userCollection: Collection

describe('Access Routes', () => {
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

  it('Should return 201 on signup', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'abcd1234',
        passwordConfirmation: 'abcd1234'
      })
      .expect(201)
  })
})
