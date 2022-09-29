#!/bin/bash
set -eu

if [[ -z ${GITHUB_REPOSITORY+x} ]]
then
  echo "ERROR: Are you running in a Github Actions pipeline? This is an implicit env var.";
  exit 1
fi

if [[ -z ${LHCI_GITHUB_TOKEN+x} ]]
then
  echo "ERROR: Is the Github API token set?";
  exit 1
fi

if [[ -z ${1+x} ]]
then
  echo "ERROR: Provide the STATE parameter (success|pending|failure|error)";
  exit 1
fi

export STATE=$1

if [[ -z ${2+x} ]]
then 
  echo "ERROR: Provide the SERVICE_APPLICATION_NAME parameter";
  exit 1
fi 

export SERVICE_APPLICATION_NAME=$2

CONTEXT="lighthouse"

if [[ "${STATE}" == "pending" ]]
then 
  DESC="Waiting for lighthouse test to complete"
  TARGET_URL="http://"

elif [[ ! -f manifest.json ]]
then 
  echo "ERROR: Could not find manifest.json file generated by lighthouse";
  STATE="error"
  DESC="Could not find manifest.json file generated by lighthouse"
  TARGET_URL="http://"

else 
  REPORT_NAME=$( ls -1 *.report.html | tail -1 )
  if [[ ! -f ${REPORT_NAME} ]]
  then
      echo "ERROR: *.report.html not found"
      exit 1
  fi

  TARGET_URL="https://storage.cloud.google.com/pretamanger-web-lab-lighthouse-audit/${SERVICE_APPLICATION_NAME}/${REPORT_NAME}"

  PERFORMANCE=$(    echo "$( cat manifest.json | jq -r '.[].summary.performance' )     * 100" | bc | awk -F'.' '{print $1}' )
  ACCESSIBILITY=$(  echo "$( cat manifest.json | jq -r '.[].summary.accessibility' )   * 100" | bc | awk -F'.' '{print $1}' )
  BEST_PRACTICES=$( echo "$( cat manifest.json | jq -r '.[].summary."best-practices"') * 100" | bc | awk -F'.' '{print $1}' )
  SEO=$(            echo "$( cat manifest.json | jq -r '.[].summary.seo' )             * 100" | bc | awk -F'.' '{print $1}' )
  DESC="Performance: ${PERFORMANCE}, Accessibility: ${ACCESSIBILITY}, Best Practices: ${BEST_PRACTICES}, Seo: ${SEO}"
fi 

curl \
  -X POST \
  -H "Authorization: token ${LHCI_GITHUB_TOKEN}" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/${GITHUB_REPOSITORY}/statuses/${PR_SHA} \
  -d "{
  \"state\": \"${STATE}\",
  \"context\": \"${CONTEXT}\",
  \"description\": \"${DESC}\",
  \"target_url\": \"${TARGET_URL}\"
}"
