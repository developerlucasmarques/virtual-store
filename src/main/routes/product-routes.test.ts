import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '@/external/db/mongo-db/helpers/mongo-helper'

describe('Product Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
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
})
