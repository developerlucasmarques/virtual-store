import { CheckoutCompletedEmailTemplate } from './checkout-completed-email-template'

type SutTypes = {
  sut: CheckoutCompletedEmailTemplate
}

const makeSut = (): SutTypes => {
  const sut = new CheckoutCompletedEmailTemplate()
  return { sut }
}

describe('CheckoutCompleted EmailTemplate', () => {
  it('Should return an HTML email template', async () => {
    const { sut } = makeSut()
    const result = sut.handle()
    expect(result.html).toContain('<!DOCTYPE html>')
    expect(result.html).toContain('<html lang="pt-BR">')
    expect(result.html).toContain('</html>')
    expect(result.html).toContain('<head>')
    expect(result.html).toContain('</head>')
    expect(result.html).toContain('<body>')
    expect(result.html).toContain('</body>')
  })

  it('Should contain the necessary properties of the email template for checkout completed', async () => {
    const { sut } = makeSut()
    const result = sut.handle()
    expect(result.html).toContain('{{orderCode}}')
    expect(result.html).toContain('{{userName}}')
    expect(result.html).toContain('{{products}}')
  })
})
