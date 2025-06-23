# caravel

## 0.1.0

### Minor Changes

- [#265](https://github.com/Stephane-Pires/caravel/pull/265) [`8d19cf6`](https://github.com/Stephane-Pires/caravel/commit/8d19cf643116e8c1f3e0e87aea4be24a2e945f21) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - - [Caravel] : Add the ability to take a RendezVous
  - [Frontend] : Add a <TakeRendezVousForm /> component
  - [Frontend] : Add a Pourparler page
  - [Frontend] : Use multiple Shadcn components (Sonner, Card, Calendar, Button, Select, Tooltip, etc..)
  - [Frontend] : Import color palette use oklch colors
  - [Backend] : Handle RendezVous logic (CRUD) with exceptions
  - [Backend] : Create a mailing service using nodemailer and ical-generator

- [#226](https://github.com/Stephane-Pires/caravel/pull/226) [`b7eba3d`](https://github.com/Stephane-Pires/caravel/commit/b7eba3de4fdc7f6bb4134664068d6c72ce2e1684) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - - [Backend] : Add PostGRES, Drizzle (generate, migrate, studio, seeding)
  - [Backend] : Create database entity (rendez-vous, contact)
  - [Backend] : Create endpoint /database/seed and /database/reset in order to seed and reset database
  - [Caravel] : Configure the devcontainer in order to launch postgres, migrate the database on running the application
  - [Caravel] : Update the documentation (README)

- [#235](https://github.com/Stephane-Pires/caravel/pull/235) [`bfe50b2`](https://github.com/Stephane-Pires/caravel/commit/bfe50b2ad3bc0a0cf8083012c78d5b620e3044e5) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - - [Backend] : Add Scalar has UI on /ui
  - [Backend] : Add OpenAPI documentation on /doc
  - [Backend] : Handle POST/GET /rendez-vous + GET /{id} Handle GET /contacts

### Patch Changes

- [#267](https://github.com/Stephane-Pires/caravel/pull/267) [`1109b38`](https://github.com/Stephane-Pires/caravel/commit/1109b389f9a9f6576e5a8b472c7bf6dada311789) Thanks [@renovate](https://github.com/apps/renovate)! - chore(app): 🧹 Update @changesets/cli from 2.29.4 to v2.29.5

- [#269](https://github.com/Stephane-Pires/caravel/pull/269) [`0f0d24e`](https://github.com/Stephane-Pires/caravel/commit/0f0d24e187df64e18c6274b8b25b2898e7a017c5) Thanks [@renovate](https://github.com/apps/renovate)! - chore(app): 🧹 Update prettier-plugin-tailwindcss from 0.6.12 to v0.6.13

- [#272](https://github.com/Stephane-Pires/caravel/pull/272) [`fdb3997`](https://github.com/Stephane-Pires/caravel/commit/fdb3997cb7dfab160bbb16a37419f42a5b36e0ec) Thanks [@renovate](https://github.com/apps/renovate)! - chore(app): 🧹 Update prettier from 3.5.3 to v3.6.0

- [#274](https://github.com/Stephane-Pires/caravel/pull/274) [`8fcf6e1`](https://github.com/Stephane-Pires/caravel/commit/8fcf6e1c1458cf5ae7008ccdcff5cf4a78a9e071) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - - [Caravel] : Add prettier-plugin-oxc and format codebase

- [#246](https://github.com/Stephane-Pires/caravel/pull/246) [`4b15e95`](https://github.com/Stephane-Pires/caravel/commit/4b15e95d75d88fb25cbfb4976e32d79120cec0d5) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - - [Backend] : Add Scalar UI at /ui
  - [Backend] : Add Openapi at /doc
  - [Backend] : Handle exception

## 0.0.2

### Patch Changes

- [#224](https://github.com/Stephane-Pires/caravel/pull/224) [`da9123f`](https://github.com/Stephane-Pires/caravel/commit/da9123f0c4d5e774f40cc420a13a3386401835ba) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - - (Caravel) : Track changeset and version at root level
  - (Backend) : Update README
