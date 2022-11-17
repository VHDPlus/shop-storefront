#!/bin/bash

# format to use:
# ./deploy.sh <cloud run name> <memory>

export ENV_VARS=$(paste -sd, .env)
gcloud run deploy $1 \
            --image "eu.gcr.io/vhdplus/storefront:latest" \
            --region "europe-west1" \
            --platform "managed" \
            --allow-unauthenticated \
            --session-affinity \
            --project=vhdplus \
            --set-env-vars=$ENV_VARS \
            --memory=$2
