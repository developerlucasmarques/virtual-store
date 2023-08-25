import jwt from 'jsonwebtoken'
import type { Encrypter, EncrypterData, Token } from '@/interactions/contracts'

export class JwtAdapter implements Encrypter {
  constructor (private readonly secretKey: string) {}

  async encrypt (data: EncrypterData): Promise<Token> {
    let expiresIn: string | undefined
    if (data.expiresInHours) {
      if (data.expiresInHours > 0) {
        expiresIn = data.expiresInHours.toString() + 'h'
      }
    }
    const token = jwt.sign({ id: data.value }, this.secretKey, { expiresIn })
    return { token }
  }
}
