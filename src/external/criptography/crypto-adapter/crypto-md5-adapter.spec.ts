import crypto from 'crypto'

import { CryptoMd5Adapter } from './crypto-md5-adapter'

jest.mock('crypto', () => ({
  createHash: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  digest: jest.fn().mockReturnValue('any_hash')
}))

const makeSut = (): CryptoMd5Adapter => {
  return new CryptoMd5Adapter()
}

describe('Crypto Adapter', () => {
  it('Should call crypto createHash with data using "MD5"', async () => {
    const sut = makeSut()
    await sut.encrypt({ value: 'any_value' })
    expect(crypto.createHash).toHaveBeenCalledWith('md5')
  })

  it('Should call crypto update with correct value', async () => {
    const sut = makeSut()
    await sut.encrypt({ value: 'any_value' })
    const update = crypto.createHash('md5').update
    expect(update).toHaveBeenCalledWith('any_value')
  })

  it('Should call crypto update digest with data using "hex"', async () => {
    const sut = makeSut()
    await sut.encrypt({ value: 'any_value' })
    const digest = crypto.createHash('md5').update('any_value').digest
    expect(digest).toHaveBeenCalledWith('hex')
  })

  it('Should throw if sign throws', async () => {
    const sut = makeSut()
    jest.spyOn(crypto, 'createHash').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.encrypt({ value: 'any_value' })
    await expect(promise).rejects.toThrow()
  })

  it('Should return this same hash as crypto returns', async () => {
    const sut = makeSut()
    const result = await sut.encrypt({ value: 'any_value' })
    expect(result).toEqual({ token: 'any_hash' })
  })
})
