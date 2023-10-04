import type { EmailTemplate, EmailTemplateResponse } from '@/domain/application-contracts'
import { OrderFormatEmail } from './order-format-email'

type OrderFormatEmailData = {
  userName: string
  orderCode: string
  another: string
}

const makeFakeOrderFormatEmailData = (): OrderFormatEmailData => ({
  userName: 'any_user_name',
  orderCode: 'any_order_code',
  another: 'any'
})

const makeEmailTemplate = (): EmailTemplate => {
  class EmailTemplateStub implements EmailTemplate {
    handle (): EmailTemplateResponse {
      return { html: 'Hello {{userName}} {{orderCode}} {{another}}' }
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

  it('Should return format email templete with correct data', async () => {
    const { sut } = makeSut()
    const result = await sut.execute(makeFakeOrderFormatEmailData())
    expect(result).toEqual('Hello any_user_name any_order_code any')
  })
})
