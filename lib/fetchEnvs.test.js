import nock from 'nock'
import { fetchEnvs } from './fetchEnvs'
import { logger } from './logger'

jest.mock('./logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}))

const mockOrigin = 'http://mock-origin.com'
const mockSentryEnvironment = 'lab-mock-environment'

describe('#fetchEnvs', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        origin: mockOrigin,
      },
    })

    nock(mockOrigin).get('/api/env-vars').reply(200, {
      SENTRY_ENVIRONMENT: mockSentryEnvironment,
    })
  })

  afterEach(() => {
    delete window.publicEnvs
  })

  test('Should fetch expected envs', async () => {
    const response = await fetchEnvs()

    expect(response).toEqual({
      SENTRY_ENVIRONMENT: mockSentryEnvironment,
    })
    expect(logger.info).toHaveBeenCalledWith(
      'Fetched envs: {"SENTRY_ENVIRONMENT":"lab-mock-environment"}'
    )
  })

  test('Should add envs to "window.publicEnvs"', async () => {
    await fetchEnvs()

    expect(logger.info).toHaveBeenCalledWith(
      'Fetched envs: {"SENTRY_ENVIRONMENT":"lab-mock-environment"}'
    )
    expect(window.publicEnvs).toEqual({
      SENTRY_ENVIRONMENT: mockSentryEnvironment,
    })
  })

  test('Should get envs from window when "publicEnvs" exists', async () => {
    await fetchEnvs()
    const response = await fetchEnvs()

    expect(logger.info).toHaveBeenCalledWith(
      'Envs: {"SENTRY_ENVIRONMENT":"lab-mock-environment"}'
    )
    expect(response).toEqual({
      SENTRY_ENVIRONMENT: mockSentryEnvironment,
    })
  })
})
