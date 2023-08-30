import type { ProductModel } from '@/domain/models'
import type { AddProductRepo, LoadAllProductsRepo, LoadProductByIdRepo } from '@/interactions/contracts'
import { MongoHelper } from '../helpers/mongo-helper'

export class ProductMongoRepo implements AddProductRepo, LoadAllProductsRepo, LoadProductByIdRepo {
  async add (data: ProductModel): Promise<void> {
    const product = MongoHelper.convertCollectionIdStringToObjectId(data)
    const productCollection = await MongoHelper.getCollection('product')
    await productCollection.insertOne(product)
  }

  async loadAll (): Promise<ProductModel[]> {
    const productCollection = await MongoHelper.getCollection('product')
    const products = await productCollection.find().toArray()
    const productsFormated = products.map((product) => (MongoHelper.convertCollectionIdObjectIdToString(product)))
    return productsFormated
  }

  async loadById (id: string): Promise<null | ProductModel> {
    const productCollection = await MongoHelper.getCollection('product')
    const objectId = MongoHelper.transformIdInObjectId(id)
    const product = await productCollection.findOne({ _id: objectId })
    return MongoHelper.convertCollectionIdObjectIdToString(product)
  }
}
