#!/bin/sh
set -eu
IFS=$'\n\t'

if test -f ci/build.manifest; then
    # We're running on github, so lets load in the manifest env vars
    . ci/build.manifest
fi

DOCKER_SOURCE_IMAGE="$SERVICE_APPLICATION_NAME:$BUILD_VERSION"
ARTIFACT_REG_REPO_NAME=$1
ARTIFACT_REG_PROJECT_ID="pretamanger-web-shared"
ARTIFACT_REG_REPO_HOST="$REGION-docker.pkg.dev"
ARTIFACT_REG_TARGET_IMAGE="$ARTIFACT_REG_REPO_HOST/$ARTIFACT_REG_PROJECT_ID/$ARTIFACT_REG_REPO_NAME/$SERVICE_APPLICATION_NAME"
LATEST_IMAGE_TAG="$ARTIFACT_REG_TARGET_IMAGE:latest"
BUILD_VERSION_TAG="$ARTIFACT_REG_TARGET_IMAGE:$BUILD_VERSION"

# TODO: move repo host to build.manifest and define in job env
echo "Configuring Docker"
gcloud auth configure-docker "${ARTIFACT_REG_REPO_HOST}"

echo "Tagging $DOCKER_SOURCE_IMAGE as :latest and $BUILD_VERSION"
docker tag "$DOCKER_SOURCE_IMAGE" "$LATEST_IMAGE_TAG"
docker tag "$DOCKER_SOURCE_IMAGE" "$BUILD_VERSION_TAG"

echo "Pushing $BUILD_VERSION_TAG"
docker push "$BUILD_VERSION_TAG"
# Cloud run is setup in terraform to pull from 'latest', and the below --image flag on deploy isn't honoured
# With docker push rightly being unable to push all the tags for specific tagged image up to GCR,  we have to push :latest
# Because GCR already has this image, it should be a quick operation
docker push "$LATEST_IMAGE_TAG"

echo "Deploying $BUILD_VERSION_TAG to $ARTIFACT_REG_PROJECT_ID as $SERVICE_APPLICATION_NAME"
gcloud run deploy --quiet --project "pretamanger-web-lab" --region "$REGION" --platform managed --image "$BUILD_VERSION_TAG" "$SERVICE_APPLICATION_NAME" --revision-suffix="$BUILD_VERSION"
