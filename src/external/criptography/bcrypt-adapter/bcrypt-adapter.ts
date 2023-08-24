import type { Hash, Hasher } from '@/interactions/contracts'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher {
  constructor (private readonly salt: number) {}

  async hashing (value: string): Promise<Hash> {
    const hash = await bcrypt.hash(value, this.salt)
    return { hash }
  }
}
