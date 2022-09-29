import { Layout } from '../../components/Layout'
import Link from 'next/link'
import { Button } from '../../components/Button'

import utilStyles from '../../styles/Util.module.css'
import React from 'react'

export default function Sentry() {
  return (
    <Layout
      pageTitle="Sentry"
      pageHeading="Viewing errors in Sentry"
      subHeading="Throw an error on this page and view it in Sentry"
    >
      <p>
        This page contains an example of throwing an error in{' '}
        <Link href="/sentry">
          <a>Sentry</a>
        </Link>
        . Click the below button to force an error. Then visit the{' '}
        <Link href="https://sentry.io/organizations/pret-a-manger/projects/hello-world-ui/?project=6011829">
          <a>Hello world UI</a>
        </Link>{' '}
        project in Pret Sentry to see information about the error thrown.
      </p>
      <p>
        For more information on how to setup Sentry for your service alongside
        useful information for setting up your CI builds please refer to the{' '}
        <Link href="https://github.com/pretamanger/hello-world-ui">
          <a>Hello world UI repository</a>
        </Link>
      </p>
      <p className={utilStyles.centered}>
        <Button
          onClick={() => {
            throw new Error('Sentry Frontend Error')
          }}
        >
          Throw Error
        </Button>
      </p>
    </Layout>
  )
}
