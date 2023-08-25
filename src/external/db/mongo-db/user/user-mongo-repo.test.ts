import type { UserModel } from '@/domain/entities/user'
import { type Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { UserMongoRepo } from './user-mongo-repo'

const idString = new ObjectId().toString()
const objectId = new ObjectId(idString)

const makeFakeUserModel = (): UserModel => ({
  id: idString,
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'abcd1234',
  role: 'customer',
  accessToken: 'any_token'
})

let userCollection: Collection

describe('UserMongo Repository', () => {
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

  it('Should create a user if add on success', async () => {
    const sut = new UserMongoRepo()
    await sut.add(makeFakeUserModel())
    const user = await userCollection.findOne({ _id: objectId })
    expect(user).toEqual(MongoHelper.mapAddCollection(makeFakeUserModel()))
  })
})
