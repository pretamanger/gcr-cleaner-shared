export default function provideEnvs(req, res) {
  res.status(200).json({
    SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
  })
}
