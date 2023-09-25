import type { Encrypter, EncrypterData, Token } from '@/interactions/contracts'
import { GenerateOrderCodeUseCase } from './generate-order-code-usecase'

const makeAccessTokenEncrypter = (): Encrypter => {
  class AccessTokenEcrypterStub implements Encrypter {
    async encrypt (data: EncrypterData): Promise<Token> {
      return { token: 'any_token' }
    }
  }
  return new AccessTokenEcrypterStub()
}

const id = 'any_user_id_1234'

type SutTypes = {
  sut: GenerateOrderCodeUseCase
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeAccessTokenEncrypter()
  const sut = new GenerateOrderCodeUseCase(encrypterStub)
  return {
    sut,
    encrypterStub
  }
}

describe('GenerateOrderCode UseCase', () => {
  it('Should return code with 15 characters', async () => {
    const { sut } = makeSut()
    const result = await sut.perform(id)
    expect(result.code.length).toBe(15)
  })

  it('Should return only numbers in each part', async () => {
    const { sut } = makeSut()
    const result = await sut.perform(id)
    const part1 = result.code.slice(0, 7)
    const part2 = result.code.slice(8)
    const test1 = /^[0-9]+$/.test(part1)
    const test2 = /^[0-9]+$/.test(part2)
    expect(test1).toBe(true)
    expect(test2).toBe(true)
  })
})
