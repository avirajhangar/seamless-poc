#!/usr/bin/env groovy
@Library('paas-shared-lib-js') _

def branchesToDeploy = [
  develop: ['int', 'test'],
]

// read more [docs](https://pages.git.daimler.com/dh-io-mbmxp/seamless/#/deployment/overview?id=main)
seamlessWebMono.runBuildPublish(
  branchesToDeploy: branchesToDeploy
)
