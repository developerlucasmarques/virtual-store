import type { UserData } from '@/domain/entities/user'
import { MongoHelper, MongoHelper as sut } from './mongo-helper'
import { MongoClient, ObjectId } from 'mongodb'

const makeFakeUserData = (): UserData => ({
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'abcd1234'
})

describe('Mongo Helper', () => {
  it('Should reconnect if MongoDB is down', async () => {
    await sut.connect(process.env.MONGO_URL)

    let userCollection = await sut.getCollection('user')
    expect(userCollection).toBeTruthy()
    await sut.disconnect()

    userCollection = await sut.getCollection('user')
    expect(userCollection).toBeTruthy()
    await sut.disconnect()
  })

  it('Should return userModel', async () => {
    const userCollection = await sut.getCollection('user')
    const result = await userCollection.insertOne(makeFakeUserData())
    const { insertedId: id } = result
    const user = sut.mapCollection(await userCollection.findOne({ _id: id }))
    expect(user).toEqual({
      id: id.toHexString(),
      ...makeFakeUserData()
    })
    await sut.disconnect()
  })

  it('Should return null if map not received collection', () => {
    const sut = MongoHelper.mapCollection({})
    expect(sut).toBeNull()
  })

  it('Should transform id string in ObjectId', () => {
    const objectId = new ObjectId()
    const sut = MongoHelper.transformIdInObjectId(objectId.toString())
    expect(sut).toEqual(objectId)
  })

  it('Should create ObjectId', () => {
    const sut = MongoHelper.createObjectId()
    expect(sut).toBeInstanceOf(ObjectId)
  })

  it('Should connect to the specified URL', async () => {
    const url = 'mongodb://127.0.0.1:27017/db-test'
    const mongoClientMock = {
      connect: jest.fn().mockResolvedValue(true)
    }
    MongoClient.connect = jest.fn().mockResolvedValue(mongoClientMock)
    await sut.connect(url)
    expect(MongoClient.connect).toHaveBeenCalledWith(url)
  })

  it('Should connect to the default URL if no URL provided', async () => {
    const defaultUrl = 'mongodb://127.0.0.1:27017/virtual-store'
    const mongoClientMock = {
      connect: jest.fn().mockResolvedValue(true)
    }
    MongoClient.connect = jest.fn().mockResolvedValue(mongoClientMock)
    await sut.connect(undefined)
    expect(MongoClient.connect).toHaveBeenCalledWith(defaultUrl)
  })
})
