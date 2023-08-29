import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'any_token'
  },

  verify (): string {
    return 'any_value'
  }
}))

const expiresIn = undefined

class JwtErrorMock extends Error {
  constructor (name: string) {
    super('Error Mock')
    this.name = name
  }
}

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('any_secret')
}

describe('JWT Adapter', () => {
  describe('sign()', () => {
    it('Should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt({ value: 'any_id', expiresInHours: 24 })
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'any_secret', { expiresIn: '24h' })
    })

    it('Should call sign without expires in hours', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt({ value: 'any_id' })
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'any_secret', { expiresIn })
    })

    it('Should call sign with expiresIn undefined if expires in hours is equal 0', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt({ value: 'any_id', expiresInHours: 0 })
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'any_secret', { expiresIn })
    })

    it('Should call sign with expiresIn undefined if expires in hours is less than 0', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt({ value: 'any_id', expiresInHours: -1 })
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'any_secret', { expiresIn })
    })

    it('Should throw if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.encrypt({ value: 'any_id' })
      await expect(promise).rejects.toThrow()
    })

    it('Should return a token if sign success', async () => {
      const sut = makeSut()
      const accessToken = await sut.encrypt({ value: 'any_id' })
      expect(accessToken).toEqual({ token: 'any_token' })
    })
  })

  describe('verify()', () => {
    test('Should call verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'any_secret')
    })

    test('Should throw if verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.decrypt('any_token')
      await expect(promise).rejects.toThrow()
    })

    test('Should return null if jwt throws an error JsonWebTokenError', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new JwtErrorMock('JsonWebTokenError')
      })
      const decryptResult = await sut.decrypt('any_token')
      expect(decryptResult).toBeNull()
    })

    test('Should return null if jwt throws an error NotBeforeError', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new JwtErrorMock('NotBeforeError')
      })
      const decryptResult = await sut.decrypt('any_token')
      expect(decryptResult).toBeNull()
    })

    test('Should return null if jwt throws an error TokenExpiredError', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new JwtErrorMock('TokenExpiredError')
      })
      const decryptResult = await sut.decrypt('any_token')
      expect(decryptResult).toBeNull()
    })

    test('Should return null if jwt throws an error SyntaxError', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new JwtErrorMock('SyntaxError')
      })
      const decryptResult = await sut.decrypt('any_token')
      expect(decryptResult).toBeNull()
    })

    test('Should return a value on verify success', async () => {
      const sut = makeSut()
      const decryptedValue = await sut.decrypt('any_token')
      expect(decryptedValue).toBe('any_value')
    })
  })
})
