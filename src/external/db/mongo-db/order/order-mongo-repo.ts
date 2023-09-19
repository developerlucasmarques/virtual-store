import type { OrderModel } from '@/domain/models'
import type { AddOrderRepo } from '@/interactions/contracts'
import { MongoHelper } from '../helpers/mongo-helper'

export class OrderMongoRepo implements AddOrderRepo {
  async add (data: OrderModel): Promise<void> {
    const order = MongoHelper.convertCollectionIdStringToObjectId(data)
    const orderCollection = await MongoHelper.getCollection('order')
    await orderCollection.insertOne(order)
  }
}
