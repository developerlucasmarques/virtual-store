import jwt from 'jsonwebtoken'
import type { Encrypter, EncrypterData, Token } from '@/interactions/contracts'

export class JwtAdapter implements Encrypter {
  constructor (private readonly secretKey: string) {}

  async encrypt (data: EncrypterData): Promise<Token> {
    const token = jwt.sign({ id: data.value }, this.secretKey, { expiresIn: '24h' })
    return { token }
  }
}
