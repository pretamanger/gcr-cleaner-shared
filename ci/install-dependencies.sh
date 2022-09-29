#!/bin/sh
set -eu
IFS=$'\n\t'

echo "Installing Dependencies"
npm ci
