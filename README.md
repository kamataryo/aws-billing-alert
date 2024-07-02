# AWS Billing Alert

![social](./socials/ogp.png)

This is a stack of AWS billing alert functions built with [Serverless](https://serverless.com/).
Once deployed, notifications would be delivered to a slack channel when the total cost exceeds specified threshold values. The scanning interval is once a day.
Also monthly report will be delivered at the end of month.

## Prerequisite

- Enable `Cost Explorer` for the targeted AWS account  
  https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html#turning_on_billing_metrics

## Deploy

```shell
$ git clone git@github.com:kamataryo/aws-billing-alert.git
$ cd aws-billing-alert
$ yarn # or npm install
$ cp .envrc.sample .envrc # Please fill the values
$ vi .envrc
$ source .envrc
$ npm run deploy
```

## Customization

See `.envrc.sample` and `serverless.yml`.

## Run Locally

```shell
$ node ./src/monthly.mjs --exec
$ node ./src/daily.mjs --exec
```
