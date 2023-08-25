import type { LogErrorRepo } from '@/interactions/contracts'
import { MongoHelper } from '../helpers/mongo-helper'

export class LogMongoRepo implements LogErrorRepo {
  async logError (stackError: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('error')
    await errorCollection.insertOne({
      stack: stackError,
      date: new Date()
    })
  }
}
