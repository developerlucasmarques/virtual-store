import { NodemailerHelper as sut } from './nodemailer-helper'
import nodemailer from 'nodemailer'

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnThis()
}))

describe('Nodemailer Helper', () => {
  it('Should call nodemailer transport with correct values', () => {
    sut.createTransport()
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'any_host@mail.com',
      port: 1234,
      secure: false,
      auth: {
        user: 'any_mail_user@mail.com',
        pass: 'any_mail_pass'
      },
      tls: { rejectUnauthorized: false }
    })
  })
})
