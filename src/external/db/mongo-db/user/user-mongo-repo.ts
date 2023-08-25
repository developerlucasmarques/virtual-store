import type { UserModel } from '@/domain/entities/user'
import type { AddUserRepo } from '@/interactions/contracts'
import { MongoHelper } from '../helpers/mongo-helper'

export class UserMongoRepo implements AddUserRepo {
  async add (data: UserModel): Promise<void> {
    const user = MongoHelper.mapAddCollection(data)
    const userCollection = await MongoHelper.getCollection('user')
    await userCollection.insertOne(user)
  }
}
