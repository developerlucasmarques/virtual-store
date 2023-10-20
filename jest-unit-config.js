const config = require('./jest.config')
config.testMatch = ['**/*.spec.ts']
config.setupFiles = ['<rootDir>/jest-set-env-vars.js']
module.exports = config
