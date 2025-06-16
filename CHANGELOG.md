# caravel

## 0.1.0

### Minor Changes

- [#226](https://github.com/Stephane-Pires/caravel/pull/226) [`b7eba3d`](https://github.com/Stephane-Pires/caravel/commit/b7eba3de4fdc7f6bb4134664068d6c72ce2e1684) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - - [Backend] : Add PostGRES, Drizzle (generate, migrate, studio, seeding)

  - [Backend] : Create database entity (rendez-vous, contact)
  - [Backend] : Create endpoint /database/seed and /database/reset in order to seed and reset database
  - [Caravel] : Configure the devcontainer in order to launch postgres, migrate the database on running the application
  - [Caravel] : Update the documentation (README)

- [#235](https://github.com/Stephane-Pires/caravel/pull/235) [`bfe50b2`](https://github.com/Stephane-Pires/caravel/commit/bfe50b2ad3bc0a0cf8083012c78d5b620e3044e5) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - - [Backend] : Add Scalar has UI on /ui
  - [Backend] : Add OpenAPI documentation on /doc
  - [Backend] : Handle POST/GET /rendez-vous + GET /{id} Handle GET /contacts

### Patch Changes

- [#246](https://github.com/Stephane-Pires/caravel/pull/246) [`4b15e95`](https://github.com/Stephane-Pires/caravel/commit/4b15e95d75d88fb25cbfb4976e32d79120cec0d5) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - - [Backend] : Add Scalar UI at /ui
  - [Backend] : Add Openapi at /doc
  - [Backend] : Handle exception

## 0.0.2

### Patch Changes

- [#224](https://github.com/Stephane-Pires/caravel/pull/224) [`da9123f`](https://github.com/Stephane-Pires/caravel/commit/da9123f0c4d5e774f40cc420a13a3386401835ba) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - - (Caravel) : Track changeset and version at root level
  - (Backend) : Update README
