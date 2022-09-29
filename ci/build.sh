#!/bin/sh
set -eu
IFS=$'\n\t'

echo "Starting Build"

echo "Installing Dependencies"
npm ci

echo "Producing build.manifest"

# Producing a manifest means we can easily track what was built, and use that info for later steps in the pipeline

SERVICE_APPLICATION_NAME=" gcr-cleaner-shared"
GIT_SHORT_REVISION=$(git rev-parse --short --abbrev-commit HEAD)
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     machine=Linux;;
    Darwin*)    machine=Mac;;
    CYGWIN*)    machine=Cygwin;;
    MINGW*)     machine=MinGw;;
    *)          machine="UNKNOWN:${unameOut}"
esac

REGION="europe-west2"

# Mac doesn't do millis and the script will halt, but we can default to the same length of 0's and fill if linux
BUILD_TIME=$(date +%s000)
if [ "${machine}" = "Linux" ]; then
  BUILD_TIME=$(( $(date '+%s%N') / 1000000 ))
fi

VERSION="$BUILD_TIME-$GIT_SHORT_REVISION"

# We output the manifest as a shell script, with the manifest variables ready to be set as environment variables
# This means we can easily load the information into subsequent steps in the pipeline, without passing arguments constantly
# However this does come with the trade off of implicit convention over explicit configuration
cat <<EOF > ci/build.manifest
#!/bin/sh
# Autogenerated build manifest from $SERVICE_APPLICATION_NAME build script below
SERVICE_APPLICATION_NAME="$SERVICE_APPLICATION_NAME"
BUILD_GIT_SHORT_REVISION="$GIT_SHORT_REVISION"
BUILD_GIT_BRANCH="$GIT_BRANCH"
BUILD_VERSION="$VERSION"
BUILD_TIME="$BUILD_TIME"
REGION="$REGION"
EOF

echo "Building docker image and tagging as $SERVICE_APPLICATION_NAME:latest and $SERVICE_APPLICATION_NAME:$VERSION"
# Tag it as latest and with the githash & timestamp for the version.
# Git hash allows us to track exactly what's inside source code
# The timestamp tells us when dependencies where baked into built into the image,
# in case we ever need to debug a difference between dependencies in a rebuild of a git commit


docker build \
          --build-arg APP_NAME="$SERVICE_APPLICATION_NAME" \
          --build-arg SENTRY_AUTH_TOKEN="$SENTRY_AUTH_TOKEN" \
          --build-arg SENTRY_RELEASE="$VERSION" \
          --build-arg NEXT_PUBLIC_SENTRY_DSN="$NEXT_PUBLIC_SENTRY_DSN" \
          -t "$SERVICE_APPLICATION_NAME":latest -t "$SERVICE_APPLICATION_NAME":"$VERSION" .
