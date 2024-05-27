import { type Express, Router } from 'express'
import { readdirSync } from 'fs'
import * as path from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  const routeDirs = readdirSync(path.join(__dirname, '..', 'routes'), { withFileTypes: true })
  routeDirs.forEach((dirent) => {
    const routeDir = path.join(__dirname, '..', 'routes', dirent.name)
    readdirSync(routeDir)
      .filter((file) => !file.includes('.test.'))
      .forEach(async (file) => {
        (await import(path.join(routeDir, file))).default(router)
      })
  })
}
