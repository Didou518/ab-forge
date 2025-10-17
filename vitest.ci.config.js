import baseConfig from './vitest.config'

const ciConfig = baseConfig

ciConfig.test.silent = true
ciConfig.test.reporter = ['default', 'html']

export default ciConfig
