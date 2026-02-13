# caravel

## 0.1.1

### Patch Changes

- [#373](https://github.com/Stephane-Pires/caravel/pull/373) [`e1ad9a4`](https://github.com/Stephane-Pires/caravel/commit/e1ad9a4da31305b0f57e292b882919624f74721a) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - Permit to run the better-commit and changeset directly from the devcontainer

- [#295](https://github.com/Stephane-Pires/caravel/pull/295) [`1fe41b5`](https://github.com/Stephane-Pires/caravel/commit/1fe41b5760e8bc592e5546178dd562ef485dcbd6) Thanks [@renovate](https://github.com/apps/renovate)! - chore(app): 🧹 Update @changesets/changelog-github from 0.5.1 to v0.5.2

- [#296](https://github.com/Stephane-Pires/caravel/pull/296) [`e72f0cc`](https://github.com/Stephane-Pires/caravel/commit/e72f0cc9df4a130dc7ae1cc3b30348c42a39654a) Thanks [@renovate](https://github.com/apps/renovate)! - chore(app): 🧹 Update @changesets/cli from 2.29.5 to v2.29.8

- [#313](https://github.com/Stephane-Pires/caravel/pull/313) [`073b659`](https://github.com/Stephane-Pires/caravel/commit/073b65967a6ca0e3c05a2b0698b55563287e9023) Thanks [@renovate](https://github.com/apps/renovate)! - chore(app): 🧹 Update prettier-plugin-tailwindcss from 0.6.13 to v0.7.2

- [#327](https://github.com/Stephane-Pires/caravel/pull/327) [`30596be`](https://github.com/Stephane-Pires/caravel/commit/30596be2042643ba28e28b06fd56472c29fe2b84) Thanks [@renovate](https://github.com/apps/renovate)! - chore(app): 🧹 Update @trivago/prettier-plugin-sort-imports from 5.2.2 to v6.0.0

- [#336](https://github.com/Stephane-Pires/caravel/pull/336) [`c2c75ff`](https://github.com/Stephane-Pires/caravel/commit/c2c75ff6233b2698df7c8518c9362a03e1648f9e) Thanks [@renovate](https://github.com/apps/renovate)! - chore(app): 🧹 Update commitlint monorepo from 19.8.1 to v20.2.0

- [#341](https://github.com/Stephane-Pires/caravel/pull/341) [`d25e0bb`](https://github.com/Stephane-Pires/caravel/commit/d25e0bba59de37a7a77f657b5e19d76f18c82e13) Thanks [@renovate](https://github.com/apps/renovate)! - chore(app): 🧹 Update Node.js from v24.11.1 to v24.12.0

- [#386](https://github.com/Stephane-Pires/caravel/pull/386) [`b54eee9`](https://github.com/Stephane-Pires/caravel/commit/b54eee9fd5049e9d7ccf61a3cbca9cfec06786bc) Thanks [@renovate](https://github.com/apps/renovate)! - chore(app): 🧹 Update commitlint monorepo from 20.2.0 to v20.3.0

- [#387](https://github.com/Stephane-Pires/caravel/pull/387) [`3eda946`](https://github.com/Stephane-Pires/caravel/commit/3eda94614459f01c815e6a3c7a24761b4c4cca17) Thanks [@renovate](https://github.com/apps/renovate)! - chore(app): 🧹 Update @trivago/prettier-plugin-sort-imports from 6.0.0 to v6.0.1

- [#394](https://github.com/Stephane-Pires/caravel/pull/394) [`ff6b146`](https://github.com/Stephane-Pires/caravel/commit/ff6b14652a483ba8e7cfbd460da4232ea9adf5a8) Thanks [@renovate](https://github.com/apps/renovate)! - chore(app): 🧹 Update commitlint monorepo from 20.3.0 to v20.4.1

- [#362](https://github.com/Stephane-Pires/caravel/pull/362) [`2048d9e`](https://github.com/Stephane-Pires/caravel/commit/2048d9ea4e1963f630be9044a3ba6a05664bd7fa) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - Add healthcheck to db inside docker-compose in order to launch the application once the database is up. Also update the path for the volume of postgres due to a change in postgres 18

- [#374](https://github.com/Stephane-Pires/caravel/pull/374) [`7385359`](https://github.com/Stephane-Pires/caravel/commit/73853591d2ffdc9f9c0f6b2771affb37a1f30220) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - Remove npmrc so that vercel pipeline can build the project. Add the npmrc configuration only for the devcontainer

- [#398](https://github.com/Stephane-Pires/caravel/pull/398) [`a50b167`](https://github.com/Stephane-Pires/caravel/commit/a50b167779b384fd14348db3345c2a22e5ae9e68) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - Add Faraway Project

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

- [#287](https://github.com/Stephane-Pires/caravel/pull/287) [`a1998c0`](https://github.com/Stephane-Pires/caravel/commit/a1998c0a8231de96602579febff1e3b9039068fa) Thanks [@renovate](https://github.com/apps/renovate)! - chore(app): 🧹 Update prettier from 3.6.0 to v3.7.4

- [#274](https://github.com/Stephane-Pires/caravel/pull/274) [`8fcf6e1`](https://github.com/Stephane-Pires/caravel/commit/8fcf6e1c1458cf5ae7008ccdcff5cf4a78a9e071) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - - [Caravel] : Add prettier-plugin-oxc and format codebase

- [#292](https://github.com/Stephane-Pires/caravel/pull/292) [`c65f220`](https://github.com/Stephane-Pires/caravel/commit/c65f220cd091052917ac3317ed731b893be56af7) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - - [Caravel] : Upgrade to Node v24
  - [Frontend] : Upgrade NextJS to v16
  - [Frontend] : Upgrade Node to v24
  - [Frontend] : Disable some eslint warning via disable-eslint on files or lines
  - [Frontend] : Fix some eslint warning
  - [Backend] : Upgrade Node to v24

- [#246](https://github.com/Stephane-Pires/caravel/pull/246) [`4b15e95`](https://github.com/Stephane-Pires/caravel/commit/4b15e95d75d88fb25cbfb4976e32d79120cec0d5) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - - [Backend] : Add Scalar UI at /ui
  - [Backend] : Add Openapi at /doc
  - [Backend] : Handle exception

## 0.0.2

### Patch Changes

- [#224](https://github.com/Stephane-Pires/caravel/pull/224) [`da9123f`](https://github.com/Stephane-Pires/caravel/commit/da9123f0c4d5e774f40cc420a13a3386401835ba) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - - (Caravel) : Track changeset and version at root level
  - (Backend) : Update README
