import { SignatureNotInformedError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers/http/http-helpers'
import { TransactionManagerController } from './transaction-manager-controller'

type SutTypes = {
  sut: TransactionManagerController
}

const makeSut = (): SutTypes => {
  const sut = new TransactionManagerController()
  return {
    sut
  }
}

describe('TransactionManager Controller', () => {
  it('Should return 400 if signature is not informed in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(badRequest(new SignatureNotInformedError()))
  })
})
