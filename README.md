# Rauch Tech

> Building dependable, human-centered technology for a safer digital world.

Rauch Tech is a technology company focused on secure, reliable, and user-first software solutions. We design and build products and services that help organizations modernize infrastructure, protect critical assets, and deliver delightful user experiences.

---

## Contents

- [About](#about)
- [Mission & Values](#mission--values)
- [What we do](#what-we-do)
- [Products & Services](#products--services)
- [Core Technologies](#core-technologies)
- [Getting Started (Developers)](#getting-started-developers)
- [Deployment & Operations](#deployment--operations)
- [Contributing](#contributing)
- [Code of Conduct](#code-of-conduct)
- [Security](#security)
- [Support & Contact](#support--contact)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## About

Rauch Tech partners with enterprises and startups to create secure, scalable, and maintainable software. Our team combines domain expertise in cloud-native architecture, security engineering, and UX design to deliver systems that perform in production and are easy to operate.

## Mission & Values

- **Mission**: Enable organizations to harness technology securely and responsibly.
- **Values**:
  - Security by design
  - Reliability and observability
  - Empathy for users and operators
  - Simplicity over complexity
  - Continuous learning and improvement

## What we do

We deliver end-to-end solutions for:
- Secure cloud migrations and platform engineering
- Application development (web, mobile, backend APIs)
- Security assessments, threat modeling, and remediation
- Observability, SRE practices, and incident response
- Custom integrations and automation

## Products & Services

Examples of offerings:
- **Rauch Platform** — opinionated Kubernetes + GitOps platform for teams
- **Rauch Shield** — managed security assessments and remediation plans
- **Rauch Insights** — observability and monitoring dashboards tailored to application SLIs
- **Professional services**: architecture reviews, implementation sprints, staff augmentation

## Core Technologies

Typical stacks we use:
- **Cloud**: AWS, GCP, Azure
- **Orchestration**: Kubernetes, Helm, Kustomize
- **CI/CD & GitOps**: GitHub Actions, Argo CD, Flux
- **Backend**: Go, Node.js, Python
- **Frontend**: React, TypeScript
- **Datastores**: PostgreSQL, Redis, S3
- **Observability**: Prometheus, Grafana, OpenTelemetry, Loki
- **Security**: OAuth2/OpenID Connect, Vault, static analysis tools

## Getting Started (Developers)

### Requirements

You should be running a currently supported version of [Node.js](https://nodejs.org/en/download/) to run this CLI. For a list of which versions of Node.js are currently supported, please see the [Node.js releases](https://nodejs.org/en/about/previous-releases) page.

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Rauch-Tech/cli.git
   cd cli
   ```

2. Install dependencies
   ```bash
   npm ci
   ```

3. Local dev environment
   - Create a `.env` from `.env.example` and provide required secrets/config (if applicable).
   - Start any required services via Docker Compose:
     ```bash
     docker compose up -d
     ```

4. Run tests
   ```bash
   npm test
   ```

5. Lint & format
   ```bash
   npm run lint
   npm run lintfix
   ```

## Deployment & Operations

- We use GitOps for production deployments. Changes merged to `main`/`production` branch are promoted automatically via Argo CD/Flux.
- Use CI pipelines (GitHub Actions) for build, test, and image publishing.
- For infrastructure, Terraform (or similar IaC) is used with a remote state backend.
- Monitoring and alerts are configured in Grafana/Alertmanager; on-call rotations use PagerDuty/Slack.

## Contributing

We welcome contributions. Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/short-description`.
3. Commit changes with clear messages.
4. Push to your fork and open a Pull Request against `main`.
5. Ensure tests pass and add changelog/notes where relevant.

Guidelines:
- Write tests for new functionality.
- Keep PRs focused and small where possible.
- Describe rationale and any upgrade/migration impacts.

See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## Code of Conduct

We are committed to an inclusive, harassment-free community. By participating, you agree to follow our Code of Conduct. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details.

## Security

If you discover a security issue, please report it privately to [security@rauchtech.example](mailto:security@rauchtech.example). Do not disclose publicly until a fix or coordinated disclosure is agreed.

See [SECURITY.md](SECURITY.md) for more information on our security reporting process.

## Support & Contact

For general inquiries or sales:
- Email: [hello@rauchtech.example](mailto:hello@rauchtech.example)
- Website: https://rauchtech.example

For developer support, open issues in the relevant repository or contact the engineering lead.

## License

This repository is licensed under the Artistic-2.0 License. See [LICENSE](LICENSE) for details.

## Acknowledgements

Thanks to our contributors, community partners, and open source projects that make our work possible.
