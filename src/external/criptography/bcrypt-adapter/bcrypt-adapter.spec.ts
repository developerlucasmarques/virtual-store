import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'
import type { ComparerData } from '@/interactions/contracts'

const makeHashComparerData = (): ComparerData => ({
  value: 'any_value',
  hash: 'any_hash'
})

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve('hash')
  },

  async compare (): Promise<boolean> {
    return await Promise.resolve(true)
  }
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    it('Should call hash with correct values', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hashing('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    it('Should return a valid hash on hash success', async () => {
      const sut = makeSut()
      const result = await sut.hashing('any_value')
      expect(result).toEqual({ hash: 'hash' })
    })

    it('Should throw if bcrypt throws', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash') as unknown as jest.Mock<
      ReturnType<(key: Error) => Promise<Error>>,
      Parameters<(key: Error) => Promise<Error>>
      >
      hashSpy.mockReturnValueOnce(
        Promise.reject(new Error())
      )
      const promise = sut.hashing('any_value')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    it('Should call bcrypt compare with correct values', async () => {
      const sut = makeSut()
      const comparerSpy = jest.spyOn(bcrypt, 'compare')
      await sut.comparer(makeHashComparerData())
      expect(comparerSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    it('Should return false when compare fails', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare') as unknown as jest.Mock<
      ReturnType<(key: false) => Promise<boolean>>,
      Parameters<(key: false) => Promise<boolean>>
      >
      compareSpy.mockReturnValueOnce(Promise.resolve(false))
      const result = await sut.comparer(makeHashComparerData())
      expect(result).toBe(false)
    })

    it('Should throw if bcrypt compare throws', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare') as unknown as jest.Mock<
      ReturnType<(key: Error) => Promise<Error>>,
      Parameters<(key: Error) => Promise<Error>>
      >
      compareSpy.mockReturnValueOnce(
        Promise.reject(new Error())
      )
      const promise = sut.comparer(makeHashComparerData())
      await expect(promise).rejects.toThrow()
    })

    it('Should return true when bcrypt compare on success', async () => {
      const sut = makeSut()
      const retulst = await sut.comparer(makeHashComparerData())
      expect(retulst).toBe(true)
    })
  })
})
