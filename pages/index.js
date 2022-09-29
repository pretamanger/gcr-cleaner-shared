import React from 'react'
import { Layout } from '../components/Layout'
import Link from 'next/link'
import { logger } from '../lib/logger'

export async function getServerSideProps(context) {
  const traceHeader =
    context.req.headers['x-cloud-trace-context'] ??
    'no-x-cloud-trace-context/id'

  return {
    props: {
      traceId: traceHeader.split('/')[0],
      GOOGLE_CLOUD_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID,
    },
  }
}

export default function Home({ traceId, GOOGLE_CLOUD_PROJECT_ID }) {
  const traceTag = {
    'logging.googleapis.com/trace': `${GOOGLE_CLOUD_PROJECT_ID}/traces/${traceId}`,
  }
  // When using pinoJs logger you can create a child with properties you wish to persist over instances of the child
  // logger. In this case adding the 'logging.googleapis.com/trace' value will set the 'trace' field in GCP logging
  // which can be used to group log entries when a common traceId
  const loggerWithTrace = logger.child(traceTag)

  loggerWithTrace.info('Welcome to the Hello world UI sample application')

  return (
    <Layout
      pageTitle="Home"
      pageHeading="Hello world UI sample application"
      subHeading="A starter pack for Pret Next.js applications"
    >
      <p>
        Welcome to the Pret Hello world UI sample application. This is a simple
        JavaScript example application created with{' '}
        <Link href="https://nextjs.org">
          <a>Next.js</a>
        </Link>
        , that speaks with our{' '}
        <Link href="https://github.com/pretamanger/hello-world-node">
          <a>Hello node world</a>
        </Link>{' '}
        service.
      </p>
      <p>
        Clone the{' '}
        <Link href="https://github.com/pretamanger/hello-world-ui">
          <a>Hello world UI</a>
        </Link>{' '}
        repository to understand this work more. Any questions about the use,
        setup or implementation of this work please contact the Platform Team.
      </p>
      <p>This app contains examples of the following:</p>
      <ul>
        <li>
          Making calls to endpoints from the{' '}
          <Link href="/frontend-api-call">
            <a>browser</a>
          </Link>{' '}
          and{' '}
          <Link href="/server-api-call">
            <a>server</a>
          </Link>
        </li>
        <li>
          <Link href="/sentry">
            <a>Sentry</a>
          </Link>{' '}
          setup
        </li>
        <li>
          <Link href="https://github.com/pinojs/pino">
            <a>PinoJs</a>
          </Link>{' '}
          logging with tracing
        </li>
        <li>
          <Link href="https://jestjs.io/">
            <a>Jest</a>
          </Link>{' '}
          test setup and examples
        </li>
        <li>
          <Link href="https://github.com/features/actions">
            <a>GitHub Actions </a>
          </Link>{' '}
          and CI scripts
        </li>
        <li>
          <Link href="https://www.docker.com">
            <a>Docker</a>
          </Link>{' '}
          example
        </li>
        <li>
          <Link href="https://sass-lang.com/">
            <a>Sass</a>
          </Link>{' '}
          and CSS example
        </li>
      </ul>
    </Layout>
  )
}
