import type { EmailTemplate, EmailTemplateResponse } from '@/domain/application-contracts'
import { FormatEmailApplication } from './format-email-application'

type FormatEmailData = {
  userName: string
  orderCode: string
  anotherField: string
}

const makeFakeFormatEmailData = (): FormatEmailData => ({
  userName: 'any_user_name',
  orderCode: 'any_order_code',
  anotherField: 'another_value'
})

const makeEmailTemplate = (): EmailTemplate => {
  class EmailTemplateStub implements EmailTemplate {
    handle (): EmailTemplateResponse {
      return { html: 'Name: {{userName}}. Order: {{orderCode}}. Another: {{anotherField}}' }
    }
  }
  return new EmailTemplateStub()
}

type SutTypes = {
  sut: FormatEmailApplication<FormatEmailData>
  emailTemplateStub: EmailTemplate
}

const makeSut = (): SutTypes => {
  const emailTemplateStub = makeEmailTemplate()
  const sut = new FormatEmailApplication<FormatEmailData>(emailTemplateStub)
  return { sut, emailTemplateStub }
}

describe('FormatEmail Application', () => {
  it('Should call EmailTemplate', async () => {
    const { sut, emailTemplateStub } = makeSut()
    const handleSpy = jest.spyOn(emailTemplateStub, 'handle')
    await sut.execute(makeFakeFormatEmailData())
    expect(handleSpy).toHaveBeenCalled()
  })

  it('Should return format email templete with correct data', async () => {
    const { sut } = makeSut()
    const result = await sut.execute(makeFakeFormatEmailData())
    expect(result).toEqual(
      'Name: any_user_name. Order: any_order_code. Another: another_value'
    )
  })
})
