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

  it('Should create a Product if add on success', async () => {
    const sut = new ProductMongoRepo()
    await sut.add(makeFakeProductModel())
    const product = await productCollection.findOne({ _id: objectId })
    const productWithMongoId = MongoHelper.convertCollectionIdStringToObjectId(makeFakeProductModel())
    expect(product).toEqual(productWithMongoId)
  })
})
