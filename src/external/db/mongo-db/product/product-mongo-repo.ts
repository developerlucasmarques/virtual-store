import type { ProductModel } from '@/domain/models'
import type { AddProductRepo } from '@/interactions/contracts'
import { MongoHelper } from '../helpers/mongo-helper'

export class ProductMongoRepo implements AddProductRepo {
  async add (data: ProductModel): Promise<void> {
    const product = MongoHelper.convertCollectionIdStringToObjectId(data)
    const productCollection = await MongoHelper.getCollection('product')
    await productCollection.insertOne(product)
  }
}
