import nodemailer, { type Transporter } from 'nodemailer'
import env from '@/main/config/env'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'

export const NodemailerHelper = {
  createTransport (): Transporter<SMTPTransport.SentMessageInfo> {
    const transport = nodemailer.createTransport({
      host: env.mailHost,
      port: Number(env.mailPort),
      secure: false,
      auth: {
        user: env.mailUser,
        pass: env.mailPass
      },
      tls: { rejectUnauthorized: false }
    })
    return transport
  }
}
