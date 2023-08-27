import type { ComparerData, Hash, HashComparer, Hasher } from '@/interactions/contracts'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}

  async hashing (value: string): Promise<Hash> {
    const hash = await bcrypt.hash(value, this.salt)
    return { hash }
  }

  async comparer (data: ComparerData): Promise<boolean> {
    const compare = await bcrypt.compare(data.value, data.hash)
    return compare
  }
}
