import type { Id, IdBuilder } from '@/interactions/contracts'
import { ObjectId } from 'mongodb'

export class IdMongo implements IdBuilder {
  build (): Id {
    const id = new ObjectId().toHexString()
    return { id }
  }
}
