import type { Request, Response } from 'express'
import app from '../config/app'
import request from 'supertest'

describe('Content Type Middleware', () => {
  it('Should return default content type as json', async () => {
    app.get('/test_content_type', (req: Request, res: Response) => {
      res.send('')
    })
    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })

  it('Should return xml content type when forced', async () => {
    app.get('/test_content_type_xml', (req: Request, res: Response) => {
      res.type('xml')
      res.send('')
    })
    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
