import type { CreateCartRepo, CreateCartRepoData } from '@/interactions/contracts'
import { MongoHelper } from '../helpers/mongo-helper'

export class CartMongoRepo implements CreateCartRepo {
  async create (data: CreateCartRepoData): Promise<void> {
    const cart = MongoHelper.convertCollectionIdStringToObjectId(data)
    const cartCollection = await MongoHelper.getCollection('cart')
    await cartCollection.insertOne(cart)
  }
}
