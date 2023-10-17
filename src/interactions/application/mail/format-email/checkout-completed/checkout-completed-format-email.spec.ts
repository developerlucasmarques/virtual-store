import type { EmailTemplate, EmailTemplateResponse, OrderFormatEmailData } from '@/domain/application-contracts'
import { CheckoutCompletedFormatEmail } from './checkout-completed-format-email'

const makeFakeOrderFormatEmailData = (): OrderFormatEmailData => ({
  userName: 'any_user_name',
  orderCode: 'any_order_code',
  products: [{
    name: 'any_product',
    amount: 10.90,
    quantity: 2
  }, {
    name: 'another_product',
    amount: 12.90,
    quantity: 1
  }]
})

const makeEmailTemplate = (): EmailTemplate => {
  class EmailTemplateStub implements EmailTemplate {
    handle (): EmailTemplateResponse {
      const html = 'Name: {{userName}}. OrderCode: {{orderCode}}. Products: {{products}}'
      return { html }
    }
  }
  return new EmailTemplateStub()
}

type SutTypes = {
  sut: CheckoutCompletedFormatEmail
  emailTemplateStub: EmailTemplate
}

const makeSut = (): SutTypes => {
  const emailTemplateStub = makeEmailTemplate()
  const sut = new CheckoutCompletedFormatEmail(emailTemplateStub)
  return { sut, emailTemplateStub }
}

describe('FormatCheckoutCompletedEmail Application', () => {
  it('Should call EmailTemplate', async () => {
    const { sut, emailTemplateStub } = makeSut()
    const handleSpy = jest.spyOn(emailTemplateStub, 'handle')
    sut.execute(makeFakeOrderFormatEmailData())
    expect(handleSpy).toHaveBeenCalled()
  })

  it('Should return EmailTemplate formated', async () => {
    const { sut } = makeSut()
    const result = sut.execute(makeFakeOrderFormatEmailData())
    expect(result.html).toEqual(
      'Name: any_user_name. OrderCode: any_order_code. Products: <li>2 any_product 10.90</li><li>1 another_product 12.90</li>'
    )
  })
})
