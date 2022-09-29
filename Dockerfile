# Multi-stage build use to remove traces from the SENTRY_AUTH_TOKEN secret
FROM node:lts-alpine@sha256:8c94a0291133e16b92be5c667e0bc35930940dfa7be544fb142e25f8e4510a45 as build

ARG APP_NAME

# required for uploading source map and release information
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_RELEASE
# required for sending errors to sentry
ARG NEXT_PUBLIC_SENTRY_DSN

RUN mkdir $APP_NAME
WORKDIR /$APP_NAME
COPY . /$APP_NAME/

# Install, lint & test
RUN npm ci && npm run lint && npm test

RUN export NODE_ENV='production' && \
    export GOOGLE_CLOUD_PROJECT_ID=projects/pretamanger-web-prod &&\
    export SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN &&\
    export SENTRY_RELEASE=$SENTRY_RELEASE &&\
    export NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN &&\
    npm run build

FROM node:lts-alpine@sha256:8c94a0291133e16b92be5c667e0bc35930940dfa7be544fb142e25f8e4510a45

ARG APP_NAME=default-app-name
ENV PORT $PORT

COPY --from=build /$APP_NAME /$APP_NAME
WORKDIR /$APP_NAME

ENTRYPOINT npm start -- -p $PORT
