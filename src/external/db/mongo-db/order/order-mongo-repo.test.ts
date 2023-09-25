import { type OrderModel } from '@/domain/models'
import { ObjectId, type Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { OrderMongoRepo } from './order-mongo-repo'
import MockDate from 'mockdate'

const idString = new ObjectId().toHexString()
const objectId = new ObjectId(idString)

const makeFakeOrderModel = (): OrderModel => ({
  id: idString,
  userId: 'any_user_id',
  orderCode: 'any_order_code',
  paymentStatus: 'Payment_Pending',
  status: 'Processing',
  createdAt: new Date(),
  updatedAt: new Date(),
  products: [{
    id: 'any_product_id',
    name: 'any name',
    amount: 10.90,
    quantity: 1
  }]
})

let orderCollection: Collection

describe('OrderMongo Repository', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    MockDate.reset()
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    orderCollection = await MongoHelper.getCollection('order')
    await orderCollection.deleteMany({})
  })

  it('Should create an order on success', async () => {
    const sut = new OrderMongoRepo()
    await sut.add(makeFakeOrderModel())
    const order = await orderCollection.findOne({ _id: objectId })
    const orderWithMongoId = MongoHelper.convertCollectionIdStringToObjectId(makeFakeOrderModel())
    expect(order).toEqual(orderWithMongoId)
  })
})
