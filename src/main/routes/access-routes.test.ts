import request from 'supertest'
import app from '@/main/config/app'
import type { Collection } from 'mongodb'
import { MongoHelper } from '@/external/db/mongo-db/helpers/mongo-helper'
import { hash } from 'bcrypt'

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

  describe('/signup', () => {
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

  describe('/login', () => {
    it('Should return 200 on login', async () => {
      const encryptedPassword = await hash('abcd1234', 12)
      await userCollection.insertOne({
        name: 'any name',
        email: 'any_email@mail.com',
        password: encryptedPassword
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@mail.com',
          password: 'abcd1234'
        })
        .expect(200)
    })

    it('Should return 401 if login fails', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@mail.com',
          password: 'abcd1234'
        })
        .expect(401)
    })
  })
})
