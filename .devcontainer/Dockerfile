FROM --platform=linux/amd64 node:16.15.0-alpine

LABEL "io.mercedes-benz.seamless"="MercedesBenz.io"
LABEL version="1.0"
LABEL description="Seamless App DevEnvironment"

# Ensure this docker file is built by VScode.
# Manual / user build of this Dockerfile is NOT supported.
ARG vscode
ARG VERSION
RUN if [[ -z "$vscode" ]] ; then printf "\nERROR: This Dockerfile NEEDS to be built with VScode !" && exit 1; else printf "VScode is detected: $vscode"; fi

RUN apk update \
# Install ssh
&& apk add openssh \
# Install git
&& apk add --no-cache git \
# Install ZSH & OhMyZsh for development inside container
&& apk add --no-cache zsh \
&& sh -c "$(wget -O- https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" \
&& echo alias gs=\'git status\' >> ~/.zshrc

# Install global seamless and test seamless command
RUN npm i -g --production --registry https://registry.npmjs.org/ \

COPY devcontainer.env devcontainer.env
COPY nexus-login.sh nexus-login.sh

# Read devcontainer.env variables for npm login. Needs to be in same RUN step as they are lost in the next step.
# Npm login for nexus registry & test if npm registry login worked
RUN sh nexus-login.sh

# Install global seamless and test seamless command
RUN npm i --loglevel=error --production -g @seamless/cli@$VERSION \
&& seamless version
