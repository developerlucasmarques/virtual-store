import 'module-alias/register'
import { MongoHelper } from '@/external/db/mongo-db/helpers/mongo-helper'
import env from './config/env'
import { StripeHelper } from '@/external/gateway/stripe/helpers/stripe-helper'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    await StripeHelper.connect(env.stripeKey)
    const app = (await import('./config/app')).default
    app.listen(env.port, () => { console.log(`Server running at http://localhost:${env.port}`) })
  })
  .catch(console.error)
