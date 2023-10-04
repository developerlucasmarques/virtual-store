import type { EmailTemplate, EmailTemplateResponse } from '@/domain/application-contracts'
import { OrderFormatEmail } from './order-format-email'

type OrderFormatEmailData = {
  userEmail: string
  userName: string
  orderCode: string
}

const makeFakeOrderFormatEmailData = (): OrderFormatEmailData => ({
  userEmail: 'any_email@mail.com',
  userName: 'any user name',
  orderCode: 'any_order_code'
})

const makeEmailTemplate = (): EmailTemplate => {
  class EmailTemplateStub implements EmailTemplate {
    handle (): EmailTemplateResponse {
      return { html: 'any_email_template' }
    }
  }
  return new EmailTemplateStub()
}

type SutTypes = {
  sut: OrderFormatEmail<OrderFormatEmailData>
  emailTemplateStub: EmailTemplate
}

const makeSut = (): SutTypes => {
  const emailTemplateStub = makeEmailTemplate()
  const sut = new OrderFormatEmail<OrderFormatEmailData>(emailTemplateStub)
  return { sut, emailTemplateStub }
}

describe('OrderFormatEmail', () => {
  it('Should call EmailTemplate', async () => {
    const { sut, emailTemplateStub } = makeSut()
    const handleSpy = jest.spyOn(emailTemplateStub, 'handle')
    await sut.execute(makeFakeOrderFormatEmailData())
    expect(handleSpy).toHaveBeenCalled()
  })
})
