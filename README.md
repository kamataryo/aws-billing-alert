# AWS Billing Alert

- Specify thresholds for AWS cost and throw alert to a certain Slack channel
- Throw monthly cost report to a certain Slack Channel

## Prereqisite

- Enable `Cost Explorer` for the targeted AWS account
- (recommended) install `direnv` to inject environmental variables

## Deploy

```shell
$ git clone git@github.com:kamataryo/aws-billing-alert.git
$ cd aws-billing-alert
$ yarn
$ cp .envrc.sample .envrc
$ vi .envrc
$ npm run deploy
```
