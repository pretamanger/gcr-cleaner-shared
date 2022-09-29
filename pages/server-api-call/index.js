// Using dotenv module to load environment variables from .env file These will then be accessible in the app using
// process.env.VAR_NAME

import { Layout } from '../../components/Layout'
import { EndpointSummary } from '../../components/EndpointSummary'
import { logger } from '../../lib/logger'
import Link from 'next/link'

export async function getServerSideProps(context) {
  const traceHeader =
    context.req.headers['x-cloud-trace-context'] ??
    'no-x-cloud-trace-context/id'
  const traceId = traceHeader.split('/')[0]
  const traceTag = {
    'logging.googleapis.com/trace': `${process.env.GOOGLE_CLOUD_PROJECT_ID}/traces/${traceId}`,
  }
  const loggerWithTrace = logger.child(traceTag)

  const apiDomain = process.env.API_DOMAIN
  const endpoint = `${apiDomain}/v1/goodbye/pret`

  loggerWithTrace.info(`Fetching data from endpoint ${endpoint}`)

  const response = await fetch(endpoint, {
    headers: { 'X-Cloud-Trace-Context': traceHeader },
  })

  const responseData = await response.json()

  loggerWithTrace.info(`Fetched data: ${JSON.stringify(responseData)}`)

  return {
    props: {
      traceTag,
      endpoint,
      responseData,
      swaggerEndpointV1: `${apiDomain}/v1`,
    },
  }
}

export default function Farewell({
  traceTag,
  endpoint,
  responseData,
  swaggerEndpointV1,
}) {
  return (
    <Layout
      pageTitle="Server API call"
      pageHeading="Request data from the Server"
      subHeading="Calling the Hello world node /v1/goodbye API endpoint"
    >
      <p>
        This page contains an example of a request to the endpoint:{' '}
        <Link href={`${swaggerEndpointV1}/#/Goodbye/getGoodBye`}>
          <a>{endpoint}</a>
        </Link>{' '}
        from this applications server. This endpoint is provided by the{' '}
        <Link href="https://github.com/pretamanger/hello-world-node">
          <a>Hello world node</a>
        </Link>{' '}
        service.
      </p>
      <p>
        The <em>X-Cloud-Trace-Context</em> header, injected by the server, for
        this request is:{' '}
        <strong>{traceTag['logging.googleapis.com/trace']}</strong>
      </p>

      <EndpointSummary
        endpointUrl={endpoint}
        response={responseData?.farewell}
      />
    </Layout>
  )
}
