# Welcome to seamless-app

<small>This project was created with [@seamless/cli](https://pages.git.daimler.com/dh-io-mbmxp/seamless/#/) v5.0.1</small>

<h1 align="center">Seamless</h1>

<div align="center">
  <strong><i>The</i> toolkit to develop micro-frontends for OneWeb</strong>
</div>
<div align="center">
  Your complete companion for creating our next-generation customer experience
</div>

<br />

Seamless is a command-line interface for the development of frontend modules for OneWeb websites. The CLI speeds up everyday tasks like bootstrapping projects and repos, scaffolding deliverable components and hooking into the OneWeb toolchain. Seamless also aims to streamline and standardize web development for Mercedes-Benz - if you are working in the world of Seamless, all frontend components should look familiar.

Key features include:

* generates standards-compliant web components
* supports VueJS framework out-of-the-box
* integrates OneWeb's Workbench library
* redux store connectors to share state with other components
* auto-generates AEM plugins to expose components to CMS authors
* includes tons of best practices for linting, testing, documentation and deployment

## Quick start

```bash
cd seamless-app
// make the script executable
chmod -R 0755 scripts
// bootstrap the complete repo
npm run setup
```

## available scripts

### npm run setup

This script will first do an npm install in the root folder of the monorepository and then bootstrap all packages with dependencies.

You can use `seamless bootstrap` to bootstrap the monorepository

The above would add the @seamless/cli as a devDependency to the package.json from the my-package (without `--dev` would be as a dependency, and with `--peer` as peerDependency and with `--dev --peer` ... you know it right?).

### npm run docs:publish

push docs folder to the repository gh-pages branch (updating your github pages documentation "site", if already properly set).

### npm run test

runs all tests of your packages (can not be done without bootstrap first).

### npm run build

 runs all builds of your packages (can not be done without bootstrap first).

### npm run docs:serve

runs the local docs folder in localhost.
