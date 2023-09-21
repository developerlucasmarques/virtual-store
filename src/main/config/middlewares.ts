import type { Express, NextFunction, Request, Response } from 'express'
import { bodyParser, contentType, cors } from '../middlewares'

export default (app: Express): void => {
  app.use(cors)
  app.use(contentType)
  app.use((req: Request, res: Response, next: NextFunction): void => {
    if (req.originalUrl === '/api/webhook') {
      next()
    } else {
      bodyParser(req, res, next)
    }
  })
}
