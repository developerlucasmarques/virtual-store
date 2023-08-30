import type { ProductModel } from '@/domain/models'
import { type Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { ProductMongoRepo } from './product-mongo-repo'

const idString = new ObjectId().toHexString()
const objectId = new ObjectId(idString)

const makeFakeProductModel = (): ProductModel => ({
  id: idString,
  name: 'any name',
  amount: 10.90,
  description: 'any description'
})

let productCollection: Collection

const makeSut = (): ProductMongoRepo => {
  const sut = new ProductMongoRepo()
  return sut
}

describe('ProductMongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    productCollection = await MongoHelper.getCollection('product')
    await productCollection.deleteMany({})
  })

  describe('add()', () => {
    it('Should create a Product if add on success', async () => {
      const sut = makeSut()
      await sut.add(makeFakeProductModel())
      const product = await productCollection.findOne({ _id: objectId })
      const productWithMongoId = MongoHelper.convertCollectionIdStringToObjectId(makeFakeProductModel())
      expect(product).toEqual(productWithMongoId)
    })
  })

  describe('loadAll()', () => {
    it('Should load all products on success', async () => {
      const sut = makeSut()
      const anotherObjectId = new ObjectId()
      const anyProduct = MongoHelper.convertCollectionIdStringToObjectId(makeFakeProductModel())
      const anotherProduct = {
        _id: anotherObjectId,
        name: 'another name',
        amount: 11.90,
        description: 'any description'
      }
      await productCollection.insertMany([anyProduct, anotherProduct])
      const products = await sut.loadAll()
      expect(products[0]).toEqual(MongoHelper.convertCollectionIdObjectIdToString(anyProduct))
      expect(products[1]).toEqual(MongoHelper.convertCollectionIdObjectIdToString(anotherProduct))
    })

    it('Should load empty list if no product was found', async () => {
      const sut = makeSut()
      const products = await sut.loadAll()
      expect(products.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    it('Should load product on success', async () => {
      const sut = makeSut()
      const productData = MongoHelper.convertCollectionIdStringToObjectId(makeFakeProductModel())
      await productCollection.insertOne(productData)
      const product = await sut.loadById(idString)
      expect(product).toEqual(MongoHelper.convertCollectionIdObjectIdToString(productData))
    })

    it('Should return null if not found a product', async () => {
      const sut = makeSut()
      const product = await sut.loadById(idString)
      expect(product).toBeNull()
    })
  })
})
