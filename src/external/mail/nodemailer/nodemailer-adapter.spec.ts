import nodemailer from 'nodemailer'
import { NodemailerAdapter } from './nodemailer-adapter'
import type { EmailSenderProviderData } from '@/interactions/contracts'

const makeFakeEmailSenderProviderData = (): EmailSenderProviderData => ({
  recipientEmail: 'any_recipient_email@mail.com',
  recipientName: 'any_recipient_name',
  subject: 'any_subject',
  html: 'any_html'
})

const makeSut = (): NodemailerAdapter => {
  return new NodemailerAdapter()
}

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnThis(),
  sendMail: jest.fn()
}))

describe('Nodemailer Adapter', () => {
  it('Should call nodemailer send mail with correct values', async () => {
    const sut = makeSut()
    await sut.sendEmail(makeFakeEmailSenderProviderData())
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith({
      from: 'Virtual Store',
      to: 'any_recipient_email@mail.com',
      subject: 'any_subject',
      html: 'any_html'
    })
  })

  it('Should throw if nodemailer send mail trhows', async () => {
    const sut = makeSut()
    jest.spyOn(nodemailer.createTransport(), 'sendMail').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.sendEmail(makeFakeEmailSenderProviderData())
    await expect(promise).rejects.toThrow()
  })
})
