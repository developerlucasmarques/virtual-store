import type { UserModel } from '@/domain/entities/user'
import type { AddUserRepo, LoadUserByEmailRepo } from '@/interactions/contracts'
import { MongoHelper } from '../helpers/mongo-helper'

export class UserMongoRepo implements AddUserRepo, LoadUserByEmailRepo {
  async add (data: UserModel): Promise<void> {
    const user = MongoHelper.convertCollectionIdStringToObjectId(data)
    const userCollection = await MongoHelper.getCollection('user')
    await userCollection.insertOne(user)
  }

  async loadByEmail (email: string): Promise<null | UserModel> {
    const userCollection = await MongoHelper.getCollection('user')
    const user = await userCollection.findOne({ email })
    return MongoHelper.convertCollectionIdObjectIdToString(user)
  }
}
