import { type OrderModel } from '@/domain/models'
import { ObjectId, type Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { OrderMongoRepo } from './order-mongo-repo'
import MockDate from 'mockdate'
import { type UpdateOrderRepoData } from '@/interactions/contracts'

const idString = new ObjectId().toHexString()
const objectId = new ObjectId(idString)

const products = [{
  id: 'any_product_id',
  name: 'any name',
  amount: 10.90,
  quantity: 1
}]

const makeFakeOrderModel = (): OrderModel => ({
  id: idString,
  userId: 'any_user_id',
  orderCode: 'any_order_code',
  paymentStatus: 'Payment_Pending',
  status: 'Processing',
  createdAt: new Date(),
  updatedAt: new Date(),
  products
})

type OrderModelWithObjectId = Omit<OrderModel, 'id'> & {
  _id: ObjectId
}

const makeFakeOrderWithObjectId = (order: OrderModel): OrderModelWithObjectId => {
  return MongoHelper.convertCollectionIdStringToObjectId(order)
}

const makeFakeUpdateOrderRepoData = (): UpdateOrderRepoData => ({
  id: idString,
  paymentStatus: 'Payment_Confirmed',
  status: 'Completed',
  updatedAt: new Date()
})

const makeFakeUpdatedOrderModel = (): OrderModel => ({
  id: idString,
  userId: 'any_user_id',
  orderCode: 'any_order_code',
  paymentStatus: 'Payment_Confirmed',
  status: 'Completed',
  createdAt: new Date(),
  updatedAt: new Date(),
  products
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

  describe('add()', () => {
    it('Should create an order on success', async () => {
      const sut = new OrderMongoRepo()
      await sut.add(makeFakeOrderModel())
      const order = await orderCollection.findOne({ _id: objectId })
      const orderWithObjectId = makeFakeOrderWithObjectId(makeFakeOrderModel())
      expect(order).toEqual(orderWithObjectId)
    })
  })

  describe('loadById()', () => {
    it('Should load an order on success', async () => {
      const sut = new OrderMongoRepo()
      const orderWithObjectId = makeFakeOrderWithObjectId(makeFakeOrderModel())
      await orderCollection.insertOne(orderWithObjectId)
      const order = await sut.loadById(idString)
      expect(order).toEqual(makeFakeOrderModel())
    })

    it('Should return null if not found a order', async () => {
      const sut = new OrderMongoRepo()
      const order = await sut.loadById(idString)
      expect(order).toBeNull()
    })
  })

  describe('updateById()', () => {
    it('Should update an order on success', async () => {
      const sut = new OrderMongoRepo()
      const orderWithObjectId = makeFakeOrderWithObjectId(makeFakeOrderModel())
      await orderCollection.insertOne(orderWithObjectId)
      const orderAdded = await orderCollection.findOne({ _id: objectId })
      await sut.updateById(makeFakeUpdateOrderRepoData())
      const updatedOrder = await orderCollection.findOne({ _id: objectId })
      const updatedOrderWithObjectId = makeFakeOrderWithObjectId(makeFakeUpdatedOrderModel())
      expect(orderWithObjectId).toEqual(orderAdded)
      expect(updatedOrder).toEqual(updatedOrderWithObjectId)
    })
  })
})
