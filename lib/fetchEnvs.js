import { logger } from './logger'

async function fetchEnvs() {
  try {
    if (typeof window?.publicEnvs !== 'undefined') {
      logger.info(`Envs: ${JSON.stringify(window?.publicEnvs)}`)

      return window?.publicEnvs
    }

    const origin = window.location.origin
    const response = await fetch(`${origin}/api/env-vars`)
    const publicEnvs = await response.json()

    window.publicEnvs = publicEnvs

    logger.info(`Fetched envs: ${JSON.stringify(publicEnvs)}`)

    return publicEnvs
  } catch (error) {
    logger.error(error)
  }
}

export { fetchEnvs }
