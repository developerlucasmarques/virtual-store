import type { AddProductToCartRepo, AddProductToCartRepoData, CreateCartRepo, CreateCartRepoData, LoadCartByUserIdRepo, UpdateProductQtyCartRepo } from '@/interactions/contracts'
import { MongoHelper } from '../helpers/mongo-helper'
import { type CartModel } from '@/domain/models'

export class CartMongoRepo implements CreateCartRepo, AddProductToCartRepo, LoadCartByUserIdRepo, UpdateProductQtyCartRepo {
  async create (data: CreateCartRepoData): Promise<void> {
    const { id, product, userId } = data
    const cartWithProductArray = { id, userId, products: [product] }
    const cart = MongoHelper.convertCollectionIdStringToObjectId(cartWithProductArray)
    const cartCollection = await MongoHelper.getCollection('cart')
    await cartCollection.insertOne(cart)
  }

  async addProduct (data: AddProductToCartRepoData): Promise<void> {
    const cartCollection = await MongoHelper.getCollection('cart')
    const objectId = MongoHelper.transformIdInObjectId(data.id)
    await cartCollection.updateOne({ _id: objectId }, { $push: { products: data.product } })
  }

  async loadByUserId (userId: string): Promise< null | CartModel> {
    const cartCollection = await MongoHelper.getCollection('cart')
    const cart = await cartCollection.findOne({ userId })
    return MongoHelper.convertCollectionIdObjectIdToString(cart)
  }

  async updateProductQty (data: AddProductToCartRepoData): Promise<void> {
    const objectId = MongoHelper.transformIdInObjectId(data.id)
    const cartCollection = await MongoHelper.getCollection('cart')
    await cartCollection.updateOne(
      { _id: objectId, 'products.id': data.product.id },
      { $inc: { 'products.$.quantity': data.product.quantity } }
    )
  }
}
