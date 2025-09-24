import * as Sentry from "@sentry/nestjs"


Sentry.init({
  dsn: process.env.SENTRY_DSN || '',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  sampleRate: 1.0,
});