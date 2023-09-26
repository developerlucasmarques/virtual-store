import type { Encrypter, EncrypterData, Token } from '@/interactions/contracts'
import * as crypto from 'crypto'

export class CryptoMd5Adapter implements Encrypter {
  async encrypt (data: EncrypterData): Promise<Token> {
    crypto.createHash('md5').update(data.value).digest('hex')
    return await Promise.resolve({ token: '' })
  }
}
