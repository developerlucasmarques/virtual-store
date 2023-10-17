import dotenv from 'dotenv'

dotenv.config()

export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://127.0.0.1:27017/virtual-store',
  port: process.env.PORT ?? 5050,
  jwtSecretKey: process.env.JWT_SECRET_KEY ?? 'secret_key_Ls9a8çF0b4c3e5T6g7h2X1Qw3E4r5T6y7',
  stripeKey: process.env.STRIPE_KEY ?? 'any_key',
  clientStripeSuccessUrl: process.env.CLIENT_STRIPE_SUCCESS_URL ?? 'http://any-success-url.com',
  clientStripeCancelUrl: process.env.CLIENT_STRIPE_SUCCESS_URL ?? 'http://any-cancel-url.com',
  webhookScret: process.env.WEBHOOK_SECRET ?? 'any_webhook_secret',
  mailHost: process.env.MAIL_HOST,
  mailPort: process.env.MAIL_PORT,
  mailUser: process.env.MAIL_USER,
  mailPass: process.env.MAIL_PASS
}
