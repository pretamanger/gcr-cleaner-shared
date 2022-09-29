// This file configures the initialization of Sentry on the browser. The config you add here will be used whenever a
// page is visited. https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'
import { fetchEnvs } from './lib/fetchEnvs'
import { logger } from './lib/logger'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

async function initialiseSentry() {
  // The environment for sentry: dev, lab or prod. This will be provided dependant on how your service is built.
  // In this example as we are using Next.js we obtain the SENTRY_ENVIRONMENT env via the /api/env-vars endpoint. The
  // SENTRY_ENVIRONMENT env is set in the container
  const { SENTRY_ENVIRONMENT } = await fetchEnvs()

  // For more information on configuration see https://docs.sentry.io/platforms/javascript/configuration/
  Sentry.init({
    dsn: SENTRY_DSN,
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1.0,

    environment: SENTRY_ENVIRONMENT,

    // Note: if you want to override the automatic release value, do not set a `release` value here - use the
    // environment variable `SENTRY_RELEASE`, so that it will also get attached to your source maps

    // Using Sampling to Filter Transaction Events
    // https://docs.sentry.io/platforms/javascript/configuration/sampling/
    // tracesSampler: (samplingContext) => {},

    // Filtering Error Events
    // https://docs.sentry.io/platforms/javascript/configuration/filtering/#filtering-error-events
    // beforeSend: (event, hint) => {},

    // De-cluttering Sentry
    // https://docs.sentry.io/platforms/javascript/configuration/filtering/#decluttering-sentry
    // allowUrls: [],
    // denyUrls: [],
    // ignoreErrors: [],
  })
}

if (SENTRY_DSN) {
  initialiseSentry().then(() => {
    logger.info('Sentry enabled')
  })
}
