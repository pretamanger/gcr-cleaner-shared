// Using dotenv module to load environment variables from .env file. These will then be accessible in the app using
// process.env.VAR_NAME

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import Link from 'next/link'

import { Layout } from '../../components/Layout'
import { logger } from '../../lib/logger'
import { EndpointSummary } from '../../components/EndpointSummary'

export async function getServerSideProps(context) {
  // Read X-Cloud-Trace-Context header injected in by GCP load balancer or calling service
  const traceHeader =
    context.req.headers['x-cloud-trace-context'] ??
    'no-x-cloud-trace-context/id'

  return {
    props: {
      traceId: traceHeader.split('/')[0],
      API_DOMAIN: process.env.API_DOMAIN,
      GOOGLE_CLOUD_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID,
    },
  }
}

export default function Greeting({
  traceId,
  API_DOMAIN,
  GOOGLE_CLOUD_PROJECT_ID,
}) {
  const [responseData, setResponseData] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const traceTag = {
    'logging.googleapis.com/trace': `${GOOGLE_CLOUD_PROJECT_ID}/traces/${traceId}`,
  }
  const loggerWithTrace = logger.child(traceTag)

  const endpoint = `${API_DOMAIN}/v1/hello?name=Pret`
  const swaggerEndpointV1 = `${API_DOMAIN}/v1`

  const { data, error } = useSWR(endpoint, (url) => {
    loggerWithTrace.info(`Fetching data from endpoint ${endpoint}`)

    return fetch(url).then((response) => response.json())
  })

  useEffect(
    function provideUIMessage() {
      if (error) {
        const message = `An error has occurred. ${error}`

        loggerWithTrace.error(message)
        setErrorMessage(message)
        setIsLoading(false)
      }

      if (data) {
        loggerWithTrace.info('Data fetched')
        setResponseData(data)
        setIsLoading(false)
      }
    },
    [data, error] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <Layout
      pageTitle="Frontend API call"
      pageHeading="Request data from the Frontend"
      subHeading="Calling the Hello world node /v1/hello API endpoint"
    >
      <p>
        This page contains an example of a request to the endpoint:{' '}
        <Link href={`${swaggerEndpointV1}/#/Hello/getHello`}>
          <a>{endpoint}</a>
        </Link>{' '}
        from this applications frontend. This endpoint is provided by the{' '}
        <Link href="https://github.com/pretamanger/hello-world-node">
          <a>Hello world node</a>
        </Link>{' '}
        service.
      </p>
      <p>
        The <em>X-Cloud-Trace-Context</em> header, injected by the GCP load
        balancer or a calling service, for this request is:{' '}
        <strong>{traceTag['logging.googleapis.com/trace']}</strong>
      </p>

      <EndpointSummary
        endpointUrl={endpoint}
        response={responseData?.greeting}
        errorMessage={errorMessage}
        isLoading={isLoading}
      />
    </Layout>
  )
}
