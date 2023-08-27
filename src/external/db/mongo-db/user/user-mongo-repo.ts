import type { UserModel } from '@/domain/models'
import type { AddUserRepo, LoadUserByEmailRepo, UpdateAccessTokenData, UpdateAccessTokenRepo } from '@/interactions/contracts'
import { MongoHelper } from '../helpers/mongo-helper'

export class UserMongoRepo implements AddUserRepo, LoadUserByEmailRepo, UpdateAccessTokenRepo {
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

  async updateAccessToken (data: UpdateAccessTokenData): Promise<void> {
    const userCollection = await MongoHelper.getCollection('user')
    const objectId = MongoHelper.transformIdInObjectId(data.userId)
    await userCollection.updateOne({ _id: objectId }, { $set: { accessToken: data.accessToken } })
  }
}
