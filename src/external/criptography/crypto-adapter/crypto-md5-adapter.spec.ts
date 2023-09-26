import crypto from 'crypto'

import { CryptoMd5Adapter } from './crypto-md5-adapter'

jest.mock('crypto', () => ({
  createHash: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  digest: jest.fn()
}))

const makeSut = (): CryptoMd5Adapter => {
  return new CryptoMd5Adapter()
}

describe('Crypto Adapter', () => {
  it('Should call crypto createHash with data using MD5', async () => {
    const sut = makeSut()
    await sut.encrypt({ value: 'testData' })
    expect(crypto.createHash).toHaveBeenCalledWith('md5')
  })

  it('Should call crypto update with correct value', async () => {
    const sut = makeSut()
    await sut.encrypt({ value: 'testData' })
    expect(crypto.createHash('md5').update).toHaveBeenCalledWith('testData')
  })
})
