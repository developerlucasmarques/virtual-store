import type { FormatEmail } from '@/domain/application-contracts'
import { EmailSenderUseCase } from './email-sender-usecase'

type EmailSenderData = {
  userEmail: string
  userName: string
  orderCode: string
}

const makeFakeEmailSenderData = (): EmailSenderData => ({
  userEmail: 'any_email@mail.com',
  userName: 'any user name',
  orderCode: 'any_order_code'
})

const makeFormatEmail = (): FormatEmail<EmailSenderData> => {
  class FormatEmailStub implements FormatEmail<EmailSenderData> {
    async execute (data: EmailSenderData): Promise<string> {
      return await Promise.resolve('any_email_formated')
    }
  }
  return new FormatEmailStub()
}

type SutTypes = {
  sut: EmailSenderUseCase<EmailSenderData>
  formatEmailStub: FormatEmail<EmailSenderData>
}

const makeSut = (): SutTypes => {
  const formatEmailStub = makeFormatEmail()
  const requiredProps: Array<keyof EmailSenderData> = ['orderCode', 'userEmail', 'userName']
  const sut = new EmailSenderUseCase<EmailSenderData>(
    requiredProps,
    formatEmailStub
  )
  return {
    sut,
    formatEmailStub
  }
}

describe('EmailSender UseCase', () => {
  it('Should contain all EmailSenderData keys in the requiredProps', async () => {
    const { sut } = makeSut()
    const requiredProps: Array<keyof EmailSenderData> = sut.requiredProps
    console.log(requiredProps)
    const allKeysPresent = Object.keys(makeFakeEmailSenderData()).every(key =>
      requiredProps.includes(key as keyof EmailSenderData)
    )
    expect(allKeysPresent).toBe(true)
  })

  it('Should call FormatEmail with correct values', async () => {
    const { sut, formatEmailStub } = makeSut()
    const executeSpy = jest.spyOn(formatEmailStub, 'execute')
    await sut.perform(makeFakeEmailSenderData())
    expect(executeSpy).toHaveBeenCalledWith(makeFakeEmailSenderData())
  })
})
