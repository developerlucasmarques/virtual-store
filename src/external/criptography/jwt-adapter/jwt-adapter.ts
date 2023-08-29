import jwt from 'jsonwebtoken'
import type { Decrypter, Encrypter, EncrypterData, Token } from '@/interactions/contracts'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secretKey: string) {}

  async encrypt (data: EncrypterData): Promise<Token> {
    let expiresIn: string | undefined
    if (data.expiresInHours && data.expiresInHours > 0) {
      expiresIn = data.expiresInHours.toString() + 'h'
    }
    const token = jwt.sign({ id: data.value }, this.secretKey, { expiresIn })
    return { token }
  }

  async decrypt (token: string): Promise<null | string> {
    try {
      const decryptedValue: any = jwt.verify(token, this.secretKey)
      return decryptedValue
    } catch (error: any) {
      for (const name of ['JsonWebTokenError', 'NotBeforeError', 'TokenExpiredError', 'SyntaxError']) {
        if (error.name === name) {
          return null
        }
      }
      console.error(error)
      throw new Error(error.message)
    }
  }
}
