import nodemailer from 'nodemailer'
import { NodemailerHelper as sut } from './nodemailer-helper'
import env from './config-env-test'

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnThis()
}))

describe('Nodemailer Helper', () => {
  it('Should call nodemailer transport with correct values', () => {
    sut.createTransport()
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: env.MAIL_HOST,
      port: Number(env.MAIL_PORT),
      secure: false,
      auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS
      },
      tls: { rejectUnauthorized: false }
    })
  })

  it('Should throw if nodemailer createTransport throws', () => {
    jest.spyOn(nodemailer, 'createTransport').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(() => sut.createTransport()).toThrow()
  })

  it('Should return Transporter if create transport is a success', async () => {
    const result = sut.createTransport()
    expect(result).toBeDefined()
  })
})
