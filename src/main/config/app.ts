import express from 'express'
import setupMiddlewares from './middlewares'
import setupeRoutes from './routes'

const app = express()
setupMiddlewares(app)
setupeRoutes(app)

export default app
