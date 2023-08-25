import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'any_token'
  }
}))

const expiresIn = undefined

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('any_secret')
}

describe('JWT Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt({ value: 'any_id', expiresInHours: 24 })
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'any_secret', { expiresIn: '24h' })
  })

  test('Should call sign without expires in hours', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt({ value: 'any_id' })
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'any_secret', { expiresIn })
  })

  test('Should call sign with expiresIn undefined if expires in hours is equal 0', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt({ value: 'any_id', expiresInHours: 0 })
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'any_secret', { expiresIn })
  })

  test('Should call sign with expiresIn undefined if expires in hours is less than 0', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt({ value: 'any_id', expiresInHours: -1 })
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'any_secret', { expiresIn })
  })

  test('Should throw if sign throws', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.encrypt({ value: 'any_id' })
    await expect(promise).rejects.toThrow()
  })

  test('Should return a token if sign success', async () => {
    const sut = makeSut()
    const accessToken = await sut.encrypt({ value: 'any_id' })
    expect(accessToken).toEqual({ token: 'any_token' })
  })
})
