CD CD DJ# npm - a JavaScript package manager

[![npm version](https://img.shields.io/npm/v/npm.svg)](https://npm.im/npm)
[![license](https://img.shields.io/npm/l/npm.svg)](https://npm.im/npm)
[![CI - cli](https://github.com/npm/cli/actions/workflows/ci.yml/badge.svg)](https://github.com/npm/cli/actions/workflows/ci.yml)
[![Benchmark Suite](https://github.com/npm/cli/actions/workflows/benchmark.yml/badge.svg)](https://github.com/npm/cli/actions/workflows/benchmark.yml)

### Requirements

One of the following versions of [Node.js](https://nodejs.org/en/download/) must be installed to run **`npm`**:

* `18.x.x` >= `18.17.0`
* `20.5.0` or higher

### Installation

**`npm`** comes bundled with [**`node`**](https://nodejs.org/), & most third-party distributions, by default. Officially supported downloads/distributions can be found at: [nodejs.org/en/download](https://nodejs.org/en/download)

#### Direct Download

You can download & install **`npm`** directly from [**npmjs**.com](https://npmjs.com/) using our custom `install.sh` script:

```bash
curl -qL https://www.npmjs.com/install.sh | sh
```

#### Node Version Managers

If you're looking to manage multiple versions of **`Node.js`** &/or **`npm`**, consider using a [node version manager](https://github.com/search?q=node+version+manager+archived%3Afalse&type=repositories&ref=advsearch)

### Usage

```bash
npm <command>
```

### Links & Resources

* [**Documentation**](https://docs.npmjs.com/) - Official docs & how-tos for all things **npm**
    * Note: you can also search docs locally with `npm help-search <query>`
* [**Bug Tracker**](https://github.com/npm/cli/issues) - Search or submit bugs against the CLI
* [**Roadmap**](https://github.com/orgs/github/projects/4247/views/1?filterQuery=npm) - Track & follow along with our public roadmap
* [**Community Feedback and Discussions**](https://github.com/orgs/community/discussions/categories/npm) - Contribute ideas & discussion around the npm registry, website & CLI
* [**RFCs**](https://github.com/npm/rfcs) - Contribute ideas & specifications for the API/design of the npm CLI
* [**Service Status**](https://status.npmjs.org/) - Monitor the current status & see incident reports for the website & registry
* [**Project Status**](https://npm.github.io/statusboard/) - See the health of all our maintained OSS projects in one view
* [**Events Calendar**](https://calendar.google.com/calendar/u/0/embed?src=npmjs.com_oonluqt8oftrt0vmgrfbg6q6go@group.calendar.google.com) - Keep track of our Open RFC calls, releases, meetups, conferences & more
* [**Support**](https://www.npmjs.com/support) - Experiencing problems with the **npm** [website](https://npmjs.com) or [registry](https://registry.npmjs.org)? File a ticket [here](https://www.npmjs.com/support)

### Acknowledgments

* `npm` is configured to use the **npm Public Registry** at [https://registry.npmjs.org](https://registry.npmjs.org) by default; Usage of this registry is subject to **Terms of Use** available at [https://npmjs.com/policies/terms](https://npmjs.com/policies/terms)
* You can configure `npm` to use any other compatible registry you prefer. You can read more about configuring third-party registries [here](https://docs.npmjs.com/cli/v7/using-npm/registry)

### FAQ on Branding

#### Is it "npm" or "NPM" or "Npm"?

**`npm`** should never be capitalized unless it is being displayed in a location that is customarily all-capitals (ex. titles on `man` pages).

#### Is "npm" an acronym for "Node Package Manager"?

Contrary to popular belief, **`npm`** **is not** in fact an acronym for "Node Package Manager"; It is a recursive bacronymic abbreviation for **"npm is not an acronym"** (if the project was named "ninaa", then it would be an acronym). The precursor to **`npm`** was actually a bash utility named **"pm"**, which was the shortform name of **"pkgmakeinst"** - a bash function that installed various things on various platforms. If **`npm`** were to ever have been considered an acronym, it would be as "node pm" or, potentially "new pm".
# Algorithms and Hardness for Learning Linear Thresholds from Label Proportions

Author: Rishi Saket

To Appear in NeurIPS'22.

# Instructions

Install cvxpy, python, numpy, pandas, cvxopt and scs in a conda environment with versions as given in requirements.txt

Activate the conda environment.

Let q = bag size (3 or 4)

In the folder bag_size_q run:

python large_margin_q-sized_LLP_LTF.py , python small_margin_q-sized_LLP_LTF.py , python processing_results_q_sized.py

Results available in tex files in the same folder.

# start
docker compose up -d
# down
docker-compose down

# version: '3'

services:
  chatgpt-demo:
    image: ddiu8081/chatgpt-demo:latest
    container_name: chatgpt-demo
    restart: always
    ports:
        - "3000:3000"
    volumes:
      - .env:/usr/src/.env

# docker run --name=chatgpt-demo --volume=/path/.env:/usr/src/.env:rw -p 3000:3000 -d ddiu8081/chatgpt-demo:latest


[code-badge]: https://img.shields.io/badge/source-black?logo=github

 OPENAI_API_KEY=sk-xxx...

# pnpm install

# @telegram-apps

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Mono-repository, containing all the packages, connected with comfortable and safe TypeScript
development on Telegram Mini Apps platform.

## Getting Started

A great starting point for learning about the platform is the community-built [documentation](https://docs.telegram-mini-apps.com). 
Additionally, the official Telegram [platform documentation](https://core.telegram.org/bots/webapps) can 
provide valuable insights and a different perspective on the platform.

Before diving into development, it’s also advisable to explore the available 
[libraries](https://docs.telegram-mini-apps.com/packages/telegram-apps-create-mini-app) for 
both client-side and backend development to gain a better understanding of the tools at your
disposal.

> [!WARNING]
> Working with `@telegram-apps` packages, you <ins>**must not**</ins> use the Telegram library - `telegram-web-app.js`.
> Using both `@telegram-apps` packages and `telegram-web-app.js` will surely lead to bugs.

## Why not Telegram SDK

Why bother creating a project like `@telegram-apps` when there are existing solutions from the developers
who own the platform? The answer is rather simple: the currently provided solution (SDK) does not
seem to meet the required minimum quality standards. Of course, the term 'quality' is rather
specific and subjective, but this section should make it more objective.

This project was born during the research of a solution provided by
Telegram - [telegram-web-app.js](https://telegram.org/js/telegram-web-app.js), which is considered
the only existing official SDK for Telegram Mini Apps by Telegram. Therefore, all the points
described in this section will be related to this package.

Because of the large section size, the complete motivation description has been moved to a [separate
document](./MOTIVATION.md).

## Contribution

Any contribution is appreciated. To start contributing, please, follow
the [Contribution Guidelines](./CONTRIBUTING.md).
