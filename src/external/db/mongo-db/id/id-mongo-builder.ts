import type { Id, IdBuilder } from '@/interactions/contracts'
import { ObjectId } from 'mongodb'
export class IdMongoBuilder implements IdBuilder {
  build (): Id {
    const id = new ObjectId().toHexString()
    return { id }
  }
}
