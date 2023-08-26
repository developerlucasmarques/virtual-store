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
    const userWithMongoId = MongoHelper.mapAddCollection(makeFakeUserModel())
    expect(user).toEqual(userWithMongoId)
  })

  it('Should return an user if loadByEmail on success', async () => {
    const sut = new UserMongoRepo()
    const userData = MongoHelper.mapAddCollection(makeFakeUserModel())
    await userCollection.insertOne(userData)
    const user = await sut.loadByEmail('any_email@mail.com')
    const userWithStringId = MongoHelper.mapCollection(userData)
    expect(user).toEqual(userWithStringId)
  })

  it('Should return null if loadByEmail fails', async () => {
    const sut = new UserMongoRepo()
    const user = await sut.loadByEmail('any_email@mail.com')
    expect(user).toBeNull()
  })
})
