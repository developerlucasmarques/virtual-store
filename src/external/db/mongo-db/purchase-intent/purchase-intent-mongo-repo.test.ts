import { ObjectId, type Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { type PurchaseIntentModel } from '@/domain/models'
import MockDate from 'mockdate'
import { PurchaseIntentMongoRepo } from './purchase-intent-mongo-repo'

let purchaseIntentCollection: Collection

const idString = new ObjectId().toHexString()
const objectId = new ObjectId(idString)

const makeFakePurchaseIntentModel = (): PurchaseIntentModel => ({
  id: idString,
  userId: 'any_user_id',
  gatewayCustomerId: 'any_gateway_customer_id',
  createdAt: new Date(),
  updateDat: new Date(),
  status: 'pending',
  products: [{
    id: 'any_product_id',
    name: 'any name',
    amount: 10.90,
    quantity: 2
  }]
})

describe('PurchaseIntentMongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    MockDate.set(new Date())
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })

  beforeEach(async () => {
    purchaseIntentCollection = await MongoHelper.getCollection('purchase-intent')
    await purchaseIntentCollection.deleteMany({})
  })

  it('Should create a PurchaseIntent if add on success', async () => {
    const sut = new PurchaseIntentMongoRepo()
    await sut.add(makeFakePurchaseIntentModel())
    const purchaseIntent = await purchaseIntentCollection.findOne({ _id: objectId })
    const purchaseIntentWithObejctId = MongoHelper.convertCollectionIdStringToObjectId(
      makeFakePurchaseIntentModel()
    )
    expect(purchaseIntent).toEqual(purchaseIntentWithObejctId)
  })
})
