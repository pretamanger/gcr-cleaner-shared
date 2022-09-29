#!/usr/bin/env bash

set -eu

if [[ -z ${1+x} ]]
then 
  echo "ERROR: Provide the SERVICE_APPLICATION_NAME parameter";
  exit 1
fi
export SERVICE_APPLICATION_NAME=$1
export LIGHTHOUSE_BUCKET="gs://pretamanger-web-lab-lighthouse-audit"

REPORT_NAME=$( ls -1 *.report.json | tail -1 )
if [[ ! -f ${REPORT_NAME} ]]
then
    echo "ERROR: *.report.json not found"
    exit 1
fi

# Meta-data for https://github.com/spotify/lighthouse-audit-service 
ID=$( uuidgen )
URL=$( jq -r '.requestedUrl' ${REPORT_NAME} ) 
TIME_CREATED=$( jq -r '.fetchTime' ${REPORT_NAME} )
DURATION=$( jq -r '.timing.total' ${REPORT_NAME} )
TIME_CREATED_EPOCH=$( date --date="${TIME_CREATED}" +"%s" )
TIME_COMPLETED_EPOCH=$( echo "${TIME_CREATED_EPOCH} + (${DURATION} /1000)" | bc )
TIME_COMPLETED=$( date -u -d @${TIME_COMPLETED_EPOCH} '+%Y-%m-%dT%H:%M:%S.000Z' )

cat >./${REPORT_NAME}.metadata.json <<EOF
{
  "id": "${ID}",
  "url": "${URL}",
  "timeCreated": "${TIME_CREATED}",
  "timeCompleted": "${TIME_COMPLETED}",
  "reportJson": "${REPORT_NAME}"
}
EOF

echo "Upload lighthouse reports to bucket"
gsutil cp ./*.report.html ${LIGHTHOUSE_BUCKET}/${SERVICE_APPLICATION_NAME}/
gsutil cp ./*.report.json ${LIGHTHOUSE_BUCKET}/${SERVICE_APPLICATION_NAME}/
gsutil cp ./*.report.json.metadata.json ${LIGHTHOUSE_BUCKET}/${SERVICE_APPLICATION_NAME}/
