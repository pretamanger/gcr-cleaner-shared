// This file sets a custom webpack configuration to use your Next.js app with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const merge = require('lodash.merge')
const { withSentryConfig } = require('@sentry/nextjs')

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

const sentryConfig = {
  sentry: {
    disableServerWebpackPlugin: true, // We only want sentry running for the frontend, GCP handles server side errors
  },
  env: {
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
}

const nextConfig = {
  env: {
    FAREWELL_API_DOMAIN: process.env.FAREWELL_API_DOMAIN,
    NEXT_PUBLIC_GREETING_API_DOMAIN:
      process.env.NEXT_PUBLIC_GREETING_API_DOMAIN,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },
}

// Additional config options for the Sentry Webpack plugin https://github.com/getsentry/sentry-webpack-plugin#options
const SentryWebpackPluginOptions = {
  silent: true,
}

const nextConfigWithSentry = withSentryConfig(
  merge(nextConfig, sentryConfig),
  SentryWebpackPluginOptions
)

// Only run sentry when the SENTRY_DSN is available. The Next.js sentry package runs auto release and uploads
// sourcemaps on build and we don't want this when running lighthouse or tests
module.exports = SENTRY_DSN ? nextConfigWithSentry : nextConfig
