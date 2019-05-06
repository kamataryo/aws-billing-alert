#!/usr/bin/env bash

ZIP_FILENAME="./archive-$npm_package_version.zip"

rm -rf node_modules
npm install --only=prod
zip -r $ZIP_FILENAME node_modules index.js

aws lambda create-function \
  --function-name $AWS_LAMBDA_FUNCTION_NAME \
  --runtime nodejs8.10 \
  --role $AWS_LAMBDA_ROLE \
  --handler index.handler \
  --zip-file "fileb://$ZIP_FILENAME" \
  --environment SLACK_INCOMMING_WEBHOOK_URL=$SLACK_INCOMMING_WEBHOOK_URL \
  --publish

create-event-source-mapping \
  --event-source-arn $AWS_CLOUDWATCH_EVENTS \
  --function-name $AWS_LAMBDA_FUNCTION_NAME

yarn

# aws lambda update-function-configuration \
#   --function-name $AWS_LAMBDA_FUNCTION_NAME \
#   --role $AWS_LAMBDA_ROLE \
#   --
