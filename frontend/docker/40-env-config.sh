#!/bin/sh
set -eu

envsubst '${VITE_API_BASE_URL} ${VITE_EVENT_NAME}' \
  < /usr/share/nginx/html/config.template.json \
  > /usr/share/nginx/html/config.json
