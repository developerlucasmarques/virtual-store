import type { PurchaseIntentModel } from '@/domain/models'
import type { AddPurchaseIntentRepo } from '@/interactions/contracts'
import { MongoHelper } from '../helpers/mongo-helper'

export class PurchaseIntentMongoRepo implements AddPurchaseIntentRepo {
  async add (data: PurchaseIntentModel): Promise<void> {
    const purchaseIntent = MongoHelper.convertCollectionIdStringToObjectId(data)
    const purchaseIntentCollection = await MongoHelper.getCollection('purchase-intent')
    await purchaseIntentCollection.insertOne(purchaseIntent)
  }
}
