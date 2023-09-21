import type { PurchaseIntentModel } from '@/domain/models'
import type { AddPurchaseIntentRepo, LoadPurchaseIntentByIdRepo } from '@/interactions/contracts'
import { MongoHelper } from '../helpers/mongo-helper'

export class PurchaseIntentMongoRepo implements AddPurchaseIntentRepo, LoadPurchaseIntentByIdRepo {
  async add (data: PurchaseIntentModel): Promise<void> {
    const purchaseIntent = MongoHelper.convertCollectionIdStringToObjectId(data)
    const purchaseIntentCollection = await MongoHelper.getCollection('purchase-intent')
    await purchaseIntentCollection.insertOne(purchaseIntent)
  }

  async loadById (id: string): Promise<null | PurchaseIntentModel > {
    const purchaseIntentCollection = await MongoHelper.getCollection('purchase-intent')
    const objectId = MongoHelper.transformIdInObjectId(id)
    const purchaseIntent = await purchaseIntentCollection.findOne({ _id: objectId })
    return MongoHelper.convertCollectionIdObjectIdToString(purchaseIntent)
  }
}
