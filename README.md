# Hello World UI

[![Link to hello-world-ui in DIgital Services COnsole, Component: hello-world-ui](https://disco.pret.com/api/badges/entity/default/component/hello-world-ui/badge/pingback "Link to hello-world-ui in DIgital Services COnsole")](https://disco.pret.com/catalog/default/component/hello-world-ui)

![Publish](https://github.com/pretamanger/hello-world-ui/actions/workflows/build-test-deploy.yml/badge.svg)

Welcome to the Pret Hello world UI sample application. This is a simple JavaScript example application created with
[Next.js](https://nextjs.org), that speaks with our [Hello world node](https://github.com/pretamanger/hello-world-node)
service.

- [Hello World UI](#hello-world-ui)
  - [Setup](#setup)
    - [Use Node Version Manager](#use-node-version-manager)
    - [Setup Config](#setup-config)
    - [Installing and Running](#installing-and-running)
  - [Local development](#local-development)
  - [Testing the Project](#testing-the-project)
  - [Code Quality](#code-quality)
    - [Formatting](#formatting)
    - [Linting](#linting)
  - [Running in Production](#running-in-production)
    - [Injecting environment variables into frontend code during build](#injecting-environment-variables-into-frontend-code-during-build)
  - [Docker](#docker)
    - [Running Docker](#running-docker)
  - [Sentry](#sentry)
    - [React setup](#react-setup)
    - [React CI setup](#react-ci-setup)
      - [Step 1 - Make env vars available to CI](#step-1---make-env-vars-available-to-ci)
      - [Step 2 - Pass env vars into build step](#step-2---pass-env-vars-into-build-step)
      - [Step 3 - Generate sourcemaps](#step-3---generate-sourcemaps)
      - [Step 4 - Create release and upload sourcemaps](#step-4---create-release-and-upload-sourcemaps)
    - [Next.js setup](#nextjs-setup)
      - [Next.js CI setup](#nextjs-ci-setup)
    - [Best practices](#best-practices)
      - [Managing your sample rate](#managing-your-sample-rate)
      - [Sentry.init() call](#sentryinit-call)
      - [Passing env vars](#passing-env-vars)
      - [Uploading sourcemaps](#uploading-sourcemaps)
    - [Configuration documentation](#configuration-documentation)
  - [Performance Test](#performance-test)
    - [How to use lighthouse to measure the UI performance](#how-to-use-lighthouse-to-measure-the-ui-performance)

## Setup

### Use Node Version Manager

Node Version Manager (nvm) is a way to manage multiple versions of Node.js and Node Package Manager (npm). It works in a similar way to other version managers such as Ruby Version Manager (rvm) and Terraform Version Manager (tfenv). Install nvm using this link -> [nvm install](https://github.com/nvm-sh/nvm#install--update-script)

### Setup Config

Environment specific configuration can be done using the [dotenv](https://www.npmjs.com/package/dotenv) node module which reads config from a `.env` file. This will allow different environment settings to be present in a development, lab and production environment. There is a `.env.template` file which needs to be copied to a `.env` file, and have the required config values filled in. _NOTE_: Do not commit the `.env` files into your git repo.

Config fields for this project and their description:

| Name                    | Description                                                   | Local development values |
| :---------------------- | :------------------------------------------------------------ | :----------------------- |
| GOOGLE_CLOUD_PROJECT_ID | Name of GCP project                                           | `pretamanger-web-lab`    |
| API_DOMAIN              | Hello wold node API domain                                    | `http://localhost:9000`  |
| SENTRY_ENVIRONMENT      | Environment used in sentry, values should be dev, lab or prod | `dev`                    |

### Installing and Running

After adding the relevant values to your `.env` file as described in the [configuration](#setup-config) section you
need to install Node.js and the dependency packages.

Use the correct version of node (using nvm). The version of Node.js to use will be picked up from the `.nvmrc` file in the git repo.

```
cd {GIT_REPO}
nvm use
```

Install the package dependencies listed in the `package.json` file.

```
npm install
```

## Local development

Then you can run the project locally using the `script` definition `dev` that is defined in `package.json`

```
npm run dev
```

## Testing the Project

To run unit tests on the project, execute jest tests using:

```
npm test
```

## Code Quality

### Formatting

To keep code looking like it has been written by one person, this project uses [Prettier](https://prettier.io/)
Please setup Prettier to run in your IDE on changes or save.

To format your work with Prettier use:

```
npm run format
```

### Linting

To lint your JavaScript use:

```
npm run lint
```

To auto fix your linting errors use:

```
npm run lint:fix
```

To run testing and linting:

```
npm run test:all
```

## Running in Production

To build the codebase for a "Production" environment use:

```
npm run build
```

To run this codebase in a "Production" environment after building the project, use:

```
npm start
```

Your app will now be available on `http://localhost:3000`

### Injecting environment variables into frontend code during build

To provide environment variables to the frontend code Next.js requires that you
[prefix these variables](https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser)
with `NEXT_PUBLIC_`. To ensure these variables are available during the CI build process within Github Actions pipeline you can
add them to your repositories secrets. Please note that environment variables prefixed with `NEXT_PUBLIC_` are added
to the frontend code and therefore must not contain secrets.

## Docker

To build the codebase for a "Production" environment using docker use:

```
./ci/build.sh
```

### Running Docker

Please use the following to run your `hello-world-ui` app:

```
docker run -p 80:8080 --env PORT=8080 --env SENTRY_ENVIRONMENT=dev hello-world-ui
```

Your app will now be available on `http://localhost`

## Sentry

- Sentry's documentation can be found [https://docs.sentry.io/](https://docs.sentry.io/)
- Pret's Sentry can be found [https://sentry.io/organizations/pret-a-manger/](https://sentry.io/organizations/pret-a-manger/)

### React setup

This section will guide you through setting up Sentry for a client side React application. To get started, follow the instructions set out in the [Sentry documentation](https://docs.sentry.io/platforms/javascript/guides/react/).

Upon completion of the React getting started guide, you should have a `Sentry.init()` call in your application somewhere, as long as you provide this function with the correct DSN, this is all you need to get started with basic error logging. The CI guide and best practices go into more detail about how to get the most out of Sentry using sourcemaps and release tagging.

### React CI setup

#### Step 1 - Make env vars available to CI

First, we need to make sure we make the following env vars available to CI:
- `SENTRY_AUTH_TOKEN` - Generated inside Sentry, allows us to upload sourcemaps and create releases, should be stored as a secret
- `SENTRY_DSN` - Our client key for Sentry, tells the Sentry module where to send our errors
- `BUILD_VERSION` - Generated in the `build.sh` script, pushed into a file called `build.manifest`, make available by reading out of the manifest and assigning as a env var
- `ENVIRONMENT` - Define at the top of your deploy.yml file

#### Step 2 - Pass env vars into build step

Inside your `*-build.yml` file, we need to make sure the env vars we defined earlier get passed into the `build.sh` execution context and set into our `.env` file.


```yml
      # build.yml
      - name: Build and test code & produce docker image and manfiest
        run: |
          sh ./ci/build.sh
        env:
          BUILD_VERSION: ${{ env.BUILD_VERSION }}
          ENVIRONMENT: ${{ env.ENVIRONMENT }}
          SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
```

```sh
# build.sh
echo BUILD_VERSION=$BUILD_VERSION >> .env
echo ENVIRONMENT=$ENVIRONMENT >> .env
echo SENTRY_DSN=$SENTRY_DSN >> .env
```

#### Step 3 - Generate sourcemaps

Ensure that sourcemaps are being generated at the lowest level possible. For most client-side React apps, this will be done at the webpack level. 

```js
// webpack.config.js
module.exports = (env) => ({
  devtool: env.production ? 'source-map' : false,
  // other config
});
```

#### Step 4 - Create release and upload sourcemaps

Sentry provide a very useful Github Action that we can use to delegate away all of the noise of uploading sourcemaps and creating releases. Just configure it using the same `BUILD_VERSION` and `ENVIRONMENT` variables that we used in the application code, and everything should match up nicely once we start receiving errors:

```yml
      - name: Create Sentry release
        uses: getsentry/action-release@v1
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          SENTRY_ORG: 'pret-a-manger'
          SENTRY_PROJECT: 'my-project-name'
          SENTRY_LOG_LEVEL: 'debug' # Leave this in if you want to see more verbose logs around what the action is doing
        with:
          sourcemaps: './.dist' # Point at your app's dist folder
          environment: ${{ env.ENVIRONMENT }}
          version: ${{ env.BUILD_VERSION }}
```

Ensure that this action passes and your release is created in Sentry's dashboard along with the associated sourcemaps - this is the basic setup complete.

### Next.js setup

This section will guide you through setting up Sentry for a Next.js application. To set up Sentry for your local
`Next.js` application:

- Set up your project using the same name as your service in the [pretamanger/sentry-infrastructure](https://github.com/pretamanger/sentry-infrastructure) repository. Once approved, merge your Pull request and your project will be available in [Sentry](https://sentry.io/organizations/pret-a-manger/projects)

- Follow the instructions in Sentry to setup your service, they have a very handy wizard 🧙
  > Note: this will create the following files:

```
- sentry.client.config.js
- sentry.server.config.js
- A duplicate of _next.config.js with Sentry information, if next.config.js allready exists, otherwise a next.config
.js file
- sentry.properties
- .sentryclirc
```

- Add `.sentryclirc` to your `.gitignore` and `.dockerignore` files. The `.sentryclirc` contains
  the Sentry API auth token which must not be committed to your repository.
  > This API auth token enables you to upload sourcemaps and create releases when you build your service. Next.js
  > does this automatically when you use `next build`
- Make a note of your `DSN` this can be found in settings in Sentry, `projects/<project-name>/keys`
  > The hello-world-node Sentry projects DSN can be seen in [https://sentry.io/settings/pret-a-manger/projects/hello-world-ui/keys/](https://sentry.io/settings/pret-a-manger/projects/hello-world-ui/keys/)
- Replace the following files created by the Sentry Wizard with the files found in this repository. This will
  enable you to only run Sentry when the `SENTRY_DSN` is present. This will enable you to run tests and lighthouse
  without Sentry

```
- sentry.client.config.js
- sentry.server.config.js
```

> Note: We do not need to use Sentry for server side errors as GCP covers these. If you wish to use Sentry for server
> side errors please speak with the Platform Team

- Combine the Sentry specific work found in the [next.config.js](./next.config.js) with your `next.config.js`. This will
  enable you to only run Sentry when the `SENTRY_DSN` is present. This will enable you to run tests and lighthouse
  without Sentry
- Leave `sentry.properties` as it is. This contains information around your Sentry project for releases and sourcemap
  uploads

- You will need to provide the environment variable `SENTRY_ENVIRONMENT` to Sentry in your frontend. This environment
  variable must contain a value of `lab` or `prod`. This will enable you to identify in Sentry which environment
  your errors are coming from
  > Note: The example shown in the `sentry.client.config.js` obtains the `SENTRY_ENVIRONMENT` from an API call. How you
  > provide `SENTRY_ENVIRONMENT` will depend on the technology your service uses. You will need to inject this into
  > your frontend at build time if your server does not have a server. Please ask the Platform Team if you have any
  > questions about this
- Create the following environment variables on your local machine:

```
export NEXT_PUBLIC_SENTRY_DSN=<your-projects-dsn>
export GOOGLE_CLOUD_PROJECT_ID=projects/pretamanger-web-lab
export SENTRY_AUTH_TOKEN=<use-the-value-in-.sentryclirc>
export SENTRY_ENVIRONMENT=dev
```

- Test your Sentry setup by throwing an error in your service. Then check this has been picked up in your Sentry
  project
  > For an example of how to throw an error that will be reported to Sentry see [./pages/sentry](./pages/sentry)

You now will have Sentry setup on your local machine

#### Next.js CI setup

To set up Sentry for your `Next.js` CI build:

- Add `NEXT_PUBLIC_SENTRY_DSN` and `SENTRY_AUTH_TOKEN` `--build-arg` to your [./ci/build.sh](./ci/build.sh) file
- Add `SENTRY_RELEASE` `--build-arg` to your [./ci/build.sh](./ci/build.sh) file, referencing the `$VERSION ` variable
  already available in `build.sh`
- Update your Docker file to perform the following steps:

  > An example of the next steps can be seen in this services [Dockerfile](./Dockerfile)

  - Be a multi-stage Docker file, with a build step containing the `SENTRY_AUTH_TOKEN` environment variable. Your
    Docker file becoming a multi-stage Docker file is so that traces from the `SENTRY_AUTH_TOKEN` environment variable are not
    published in your final Docker image
  - Add the `SENTRY_AUTH_TOKEN`, `SENTRY_RELEASE` and `NEXT_PUBLIC_SENTRY_DSN` ARG's
  - Export the above ARG's to be used during your `next build` process

- Provide the following environment variables to your `build-test-deploy.yaml` GitHub Action:

```
env:
  NEXT_PUBLIC_SENTRY_DSN: ${{ secrets.NEXT_PUBLIC_SENTRY_DSN }}
  SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
```

- Add `NEXT_PUBLIC_SENTRY_DSN` and `SENTRY_AUTH_TOKEN` to your repositories GitHub secrets these are both needed
  during your services build when using `next build`. `SENTRY_AUTH_TOKEN` allows Next.js to auto upload sourcemaps and
  create a release
- Add the `SENTRY_ENVIRONMENT` token to your container via `website-infrastructure` if you use a server. Otherwise
  you will need to provide the environment variable `SENTRY_ENVIRONMENT` to Sentry in your frontend. This environment
  variable must contain a value of `lab` or `prod`. This will enable you to identify in Sentry which environment
  your errors are coming from

  > Note: The example shown in the `sentry.client.config.js` obtains the `SENTRY_ENVIRONMENT` from an API call. How you
  > provide this will depend on the technology your service uses. You will need to inject this into your frontend at
  > build time if your server does not have a server. Please ask the Platform Team if you have any questions about this

- You can easily check this setup is working on your local machine by creating your docker image by using the
  same script as Github Actions pipeline will:

```
./ci/build.sh
```

> Note: you will need to set the environment variables locally

```
 export NEXT_PUBLIC_SENTRY_DSN=<your-projects-dsn>
 export GOOGLE_CLOUD_PROJECT_ID=projects/pretamanger-web-lab
 export SENTRY_AUTH_TOKEN=<use-the-value-in-.sentryclirc>
 export SENTRY_ENVIRONMENT=dev
```

- Run the built docker file:
  `docker run -p 80:8080 --env PORT=8080 hello-world-ui`
- Test your Sentry setup by throwing an error in your service. Then check this has been picked up in your Sentry
  project
  > For an example of how to throw an error that will be reported to Sentry see [./pages/sentry](./pages/sentry)

You now will have Sentry setup and ready to be run on your CI build

### Best practices

#### Managing your sample rate

For information around managing quotas and noisy errors: [https://docs.sentry.io/product/accounts/quotas/manage-event-stream-guide](https://docs.sentry.io/product/accounts/quotas/manage-event-stream-guide)

#### Sentry.init() call

It's a good idea to move the call to a different file, and wrap it inside a function. This way we can check that Sentry has everything it needs before trying to initialise it:

```js
import * as Sentry from '@sentry/react'

export const initSentry = () => {
  // Don't let sentry initialise if it doesn't have the correct information
  if (!process.env.SENTRY_DSN || !process.env.BUILD_VERSION || !process.env.ENVIRONMENT) {
    return
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.ENVIRONMENT,
    release: process.env.BUILD_VERSION,
    tracesSampleRate: 1.0,
  })
}
```

#### Passing env vars

It's also useful to setup environment variables that we can pass into our applications relating to the current environment and which release the application is running. This way when we are tracking errors using the sentry UI, we will be able to understand which commit caused the issue.

#### Uploading sourcemaps

Giving Sentry access to sourcemaps is an extremely beneficial thing to do. They point us to the place that the error is occuring in the sourcecode. Without sourcemaps we would have to trawl through a transpiled and minified bundle output, which is often hard to understand. [Learn more about sourcemaps here](https://docs.sentry.io/platforms/javascript/guides/react/sourcemaps/). (We will cover how best to upload them in the [React CI setup section](#react-ci-setup)) 

> Note: Some Sentry modules handle uploading sourcemaps by default. If configuring Sentry using the Next.js guide in this document, sourcemaps will be uploaded automatically.

### Configuration documentation

For detailed information around Sentry configuration, the configuration documentation can be found: [https://docs.sentry.io/platforms/javascript/configuration/](https://docs.sentry.io/platforms/javascript/configuration/). Please see below for setup specific to our platform.

## Performance Test

### How to use lighthouse to measure the UI performance

The [Lighthouse](https://github.com/GoogleChrome/lighthouse-ci) performance tests are used to audit the performance of a web-UI.

To run lighthouse you need to:

- exclude lighthouse working files and reports in the .gitignore file
- setup `lighthouserc.js` with how lighthouse should run. See this [configuration link](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md) for more options
- Install `npm install -g @lhci/cli`
- Create the `./ci/lighthouse-upload-report.sh` to store the reports in the GCP bucket
- Create the `./ci/lighthouse-post-status.sh` to send the report data to the github PR
- Amend the Github Actions pipeline `check-pr.yml` so that lighthouse is run during the check PR phase
- NOTE: You can add the environment variable `LHCI_GITHUB_TOKEN` to the pipeline for the lighthouse test status to
  be reported in the Github PR

You can run Lighthouse tests locally by running the below command:

```
lhci autorun
```

> Generated reports have the name `_.report.html` and `_.report.json`
