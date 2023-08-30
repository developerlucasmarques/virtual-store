import type { Id, IdBuilder } from '@/interactions/contracts'
import type { IdValidator } from '@/presentation/contracts'
import { ObjectId } from 'mongodb'

export class IdMongo implements IdBuilder, IdValidator {
  build (): Id {
    const id = new ObjectId().toHexString()
    return { id }
  }

  isValid (id: string): boolean {
    return ObjectId.isValid(id)
  }
}
