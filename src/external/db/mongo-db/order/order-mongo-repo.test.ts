import { type OrderModel } from '@/domain/models'
import { ObjectId, type Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { OrderMongoRepo } from './order-mongo-repo'

const idString = new ObjectId().toHexString()
const objectId = new ObjectId(idString)

const makeOrderModel = (): OrderModel => ({
  id: idString,
  userId: 'any_user_id',
  products: [{
    id: 'any_product_id',
    name: 'any_product_name',
    amount: 10.90,
    quantity: 2
  }]
})

let orderCollection: Collection

describe('OrderMongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    orderCollection = await MongoHelper.getCollection('order')
    await orderCollection.deleteMany({})
  })

  it('Should create an order on success', async () => {
    const sut = new OrderMongoRepo()
    await sut.add(makeOrderModel())
    const order = await orderCollection.findOne({ _id: objectId })
    const orderWithMongoId = MongoHelper.convertCollectionIdStringToObjectId(makeOrderModel())
    expect(order).toEqual(orderWithMongoId)
  })
})
