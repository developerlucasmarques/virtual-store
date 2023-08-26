import request from 'supertest'
import app from '../config/app'
import type { Request, Response } from 'express'

describe('Body Parser Middleware', () => {
  it('Should parse body as json', async () => {
    app.post('/test_body_parser', (req: Request, res: Response) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test_body_parser')
      .send({ name: 'any name' })
      .expect({ name: 'any name' })
  })
})
