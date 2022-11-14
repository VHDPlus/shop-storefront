#!/bin/bash
docker build -t eu.gcr.io/vhdplus/storefront .
# Configure docker to use Google authentication
gcloud auth configure-docker -q
docker push eu.gcr.io/vhdplus/storefront
