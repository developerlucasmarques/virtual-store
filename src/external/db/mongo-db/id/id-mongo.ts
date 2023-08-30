import type { Id, IdBuilder, ValidationId } from '@/interactions/contracts'
import { ObjectId } from 'mongodb'

export class IdMongo implements IdBuilder, ValidationId {
  build (): Id {
    const id = new ObjectId().toHexString()
    return { id }
  }

  isValid (id: string): boolean {
    return ObjectId.isValid(id)
  }
}
