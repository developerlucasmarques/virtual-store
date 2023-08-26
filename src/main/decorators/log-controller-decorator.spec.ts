import type { AccessToken } from '@/domain/usecases-contracts'
import type { LogErrorRepo } from '@/interactions/contracts'
import type { Controller } from '@/presentation/contracts'
import { created, serverError } from '@/presentation/helpers/http/http-helpers'
import type { HttpRequest, HttpResponse } from '@/presentation/http-types/http'
import { LogControllerDecorator } from './log-controller-decorator'

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(created(makeFakeAccessToken()))
    }
  }
  return new ControllerStub()
}

const makeLogErrorRepo = (): LogErrorRepo => {
  class LogErrorRepositoryStub implements LogErrorRepo {
    async logError (stackError: string): Promise<void> {
      await Promise.resolve()
    }
  }
  return new LogErrorRepositoryStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any name',
    email: 'any_email',
    password: 'password1234',
    passwordConfirmation: 'password1234'
  }
})

const makeFakeAccessToken = (): AccessToken => ({
  accessToken: 'any_token'
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepoStub: LogErrorRepo
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepoStub = makeLogErrorRepo()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepoStub)
  return {
    sut,
    controllerStub,
    logErrorRepoStub
  }
}

describe('LogController Decorator', () => {
  it('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(makeFakeRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  it('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(created(makeFakeAccessToken()))
  })

  it('Should call LogErrorRepo with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepoStub } = makeSut()
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
      Promise.resolve(makeFakeServerError())
    )
    const logSpy = jest.spyOn(logErrorRepoStub, 'logError')
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
