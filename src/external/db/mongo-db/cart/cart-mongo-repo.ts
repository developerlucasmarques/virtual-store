import type { AddProductToCartRepo, AddProductToCartRepoData, CreateCartRepo, CreateCartRepoData } from '@/interactions/contracts'
import { MongoHelper } from '../helpers/mongo-helper'

export class CartMongoRepo implements CreateCartRepo, AddProductToCartRepo {
  async create (data: CreateCartRepoData): Promise<void> {
    const cart = MongoHelper.convertCollectionIdStringToObjectId(data)
    const cartCollection = await MongoHelper.getCollection('cart')
    await cartCollection.insertOne(cart)
  }

  async addProduct (data: AddProductToCartRepoData): Promise<void> {
    const cartCollection = await MongoHelper.getCollection('cart')
    const objectId = MongoHelper.transformIdInObjectId(data.id)
    await cartCollection.updateOne({ _id: objectId }, { $push: { products: data.product } })
  }
}
