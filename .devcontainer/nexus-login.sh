#!/bin/sh
echo "Checking NEXUS registry login status..."; echo;

# load ENV variables
$(cat ./devcontainer.env)

if (npm whoami --registry=https://nexus.cicd.intra.oneweb.mercedes-benz.io/repository/npm-general/ | grep $NPM_USER); then
  echo; echo "SUCCESS. Logged in NEXUS npm registry"; echo;
else
  echo; echo "NOT logged in NEXUS npm registry. Logging in..."; echo;

  # build /root/.npmrc file
  echo "registry=https://nexus.cicd.intra.oneweb.mercedes-benz.io/repository/npm-general/" > /root/.npmrc
  echo "email=$NPM_EMAIL" >> /root/.npmrc
  printf "_auth=" >> /root/.npmrc
  printf "$NPM_USER:$NPM_TOKEN" | base64 >> /root/.npmrc
  echo "//nexus.cicd.intra.oneweb.mercedes-benz.io/repository/npm-general/:_auth=" >> /root/.npmrc
  printf "$NPM_USER:$NPM_TOKEN" | base64 >> /root/.npmrc
  echo "always-auth=true" >> /root/.npmrc

  # check if nexus login worked
  if (npm whoami | grep $NPM_USER); then
    echo; echo "NEXUS LOGIN SUCCESS";
  else
    echo; echo "NEXUS LOGIN ERROR";
  fi
fi
