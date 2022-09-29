import pino from 'pino'

const logger = pino({ name: 'hello-world-ui', browser: { asObject: true } })

export { logger }
