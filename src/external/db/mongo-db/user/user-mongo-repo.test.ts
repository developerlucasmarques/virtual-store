import type { UserModel } from '@/domain/models'
import { type Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { UserMongoRepo } from './user-mongo-repo'

const idString = new ObjectId().toHexString()
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

  describe('add()', () => {
    it('Should create a user if add on success', async () => {
      const sut = new UserMongoRepo()
      await sut.add(makeFakeUserModel())
      const user = await userCollection.findOne({ _id: objectId })
      const userWithMongoId = MongoHelper.convertCollectionIdStringToObjectId(makeFakeUserModel())
      expect(user).toEqual(userWithMongoId)
    })
  })

  describe('loadByEmail()', () => {
    it('Should return an user if loadByEmail on success', async () => {
      const sut = new UserMongoRepo()
      const userData = MongoHelper.convertCollectionIdStringToObjectId(makeFakeUserModel())
      await userCollection.insertOne(userData)
      const user = await sut.loadByEmail('any_email@mail.com')
      const userWithStringId = MongoHelper.convertCollectionIdObjectIdToString(userData)
      expect(user).toEqual(userWithStringId)
    })

    it('Should return null if loadByEmail fails', async () => {
      const sut = new UserMongoRepo()
      const user = await sut.loadByEmail('any_email@mail.com')
      expect(user).toBeNull()
    })
  })

  describe('updateAccessToken', () => {
    it('Should update access token if updateAccessToken on success', async () => {
      const sut = new UserMongoRepo()
      const userModel = MongoHelper.convertCollectionIdStringToObjectId(makeFakeUserModel())
      await userCollection.insertOne(userModel)
      await sut.updateAccessToken({ userId: idString, accessToken: 'another_token' })
      const user = await userCollection.findOne({ _id: objectId })
      expect(user?.accessToken).toBe('another_token')
    })
  })

  describe('loadById()', () => {
    test('Should return an user if loadById on success', async () => {
      const sut = new UserMongoRepo()
      const userData = MongoHelper.convertCollectionIdStringToObjectId(makeFakeUserModel())
      await userCollection.insertOne(userData)
      const user = await sut.loadById(idString)
      console.log(user)
      expect(user).toEqual(makeFakeUserModel())
    })
  })
})
