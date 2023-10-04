import type { FormatEmail } from '@/domain/application-contracts'
import { EmailSenderUseCase } from './email-sender-usecase'
import type { EmailSenderProvider, EmailSenderProviderData } from '@/interactions/contracts'
import type { RequiredFieldEmailSender } from '@/domain/usecases-contracts'

type EmailSenderData = RequiredFieldEmailSender & {
  orderCode: string
}

const makeFakeEmailSenderData = (): EmailSenderData => ({
  userEmail: 'any_email@mail.com',
  userName: 'any user name',
  orderCode: 'any_order_code'
})

const makeFakeEmailSenderProviderData = (): EmailSenderProviderData => ({
  recipientName: 'any user name',
  recipientEmail: 'any_email@mail.com',
  subject: 'any_subject',
  html: 'any_email_formated'
})

const makeFormatEmail = (): FormatEmail<EmailSenderData> => {
  class FormatEmailStub implements FormatEmail<EmailSenderData> {
    async execute (data: EmailSenderData): Promise<string> {
      return await Promise.resolve('any_email_formated')
    }
  }
  return new FormatEmailStub()
}

const makeEmailSenderProvider = (): EmailSenderProvider => {
  class EmailSenderProviderStub implements EmailSenderProvider {
    async sendEmail (data: EmailSenderProviderData): Promise<void> {
      await Promise.resolve()
    }
  }
  return new EmailSenderProviderStub()
}

type SutTypes = {
  sut: EmailSenderUseCase<EmailSenderData>
  formatEmailStub: FormatEmail<EmailSenderData>
  emailSenderProviderStub: EmailSenderProvider
}

const makeSut = (): SutTypes => {
  const requiredProps: Array<keyof EmailSenderData> = ['orderCode', 'userEmail', 'userName']
  const formatEmailStub = makeFormatEmail()
  const emailSenderProviderStub = makeEmailSenderProvider()
  const subject = 'any_subject'
  const sut = new EmailSenderUseCase<EmailSenderData>(
    requiredProps,
    subject,
    formatEmailStub,
    emailSenderProviderStub
  )
  return {
    sut,
    formatEmailStub,
    emailSenderProviderStub
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

  it('Should call EmailSenderProvider with correct values', async () => {
    const { sut, emailSenderProviderStub } = makeSut()
    const sendEmailSpy = jest.spyOn(emailSenderProviderStub, 'sendEmail')
    await sut.perform(makeFakeEmailSenderData())
    expect(sendEmailSpy).toHaveBeenCalledWith(makeFakeEmailSenderProviderData())
  })

  it('Should throw if EmailSenderProvider throws', async () => {
    const { sut, emailSenderProviderStub } = makeSut()
    jest.spyOn(emailSenderProviderStub, 'sendEmail').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeEmailSenderData())
    await expect(promise).rejects.toThrow()
  })
})
