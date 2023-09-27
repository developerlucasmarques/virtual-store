import type { GenerateOrderCode } from '@/domain/usecases-contracts'
import { CryptoMd5Adapter } from '@/external/criptography/crypto-adapter/crypto-md5-adapter'
import { GenerateOrderCodeUseCase } from '@/interactions/usecases/order'

export const makeGenerateOrderCodeUseCase = (): GenerateOrderCode => {
  const cryptoMd5Adapter = new CryptoMd5Adapter()
  return new GenerateOrderCodeUseCase(cryptoMd5Adapter)
}
