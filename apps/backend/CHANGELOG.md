# backend

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

- [#228](https://github.com/Stephane-Pires/caravel/pull/228) [`5a5cabb`](https://github.com/Stephane-Pires/caravel/commit/5a5cabb9c33e6f625bf9315714d483a6638a37b6) Thanks [@renovate](https://github.com/apps/renovate)! - chore(backend): 🧹 Pin dependencies

- [#231](https://github.com/Stephane-Pires/caravel/pull/231) [`6210e14`](https://github.com/Stephane-Pires/caravel/commit/6210e1439238603e2716e97401c187bea077091d) Thanks [@renovate](https://github.com/apps/renovate)! - chore(backend): 🧹 Update zod from 3.25.56 to v3.25.57

- [#232](https://github.com/Stephane-Pires/caravel/pull/232) [`3fc5f34`](https://github.com/Stephane-Pires/caravel/commit/3fc5f34db7c957db4cb96feea41e7019faa0e62a) Thanks [@renovate](https://github.com/apps/renovate)! - chore(frontend): 🧹 Update @types/node from 22.15.30 to v22.15.31

- [#237](https://github.com/Stephane-Pires/caravel/pull/237) [`d5671a4`](https://github.com/Stephane-Pires/caravel/commit/d5671a4367a0aada7dcb71ac411f996b4be203cf) Thanks [@renovate](https://github.com/apps/renovate)! - chore(backend): 🧹 Update zod from 3.25.57 to v3.25.58

- [#240](https://github.com/Stephane-Pires/caravel/pull/240) [`ab532ee`](https://github.com/Stephane-Pires/caravel/commit/ab532eeb000ad4df56a6cbc0ec2f5569dfac74a7) Thanks [@renovate](https://github.com/apps/renovate)! - chore(backend): 🧹 Update zod from 3.25.63 to v3.25.63

- [#245](https://github.com/Stephane-Pires/caravel/pull/245) [`0fc5d8d`](https://github.com/Stephane-Pires/caravel/commit/0fc5d8ddddadbe8212a4864ef1f791607b7785ba) Thanks [@renovate](https://github.com/apps/renovate)! - chore(backend): 🧹 Update tsx from 4.19.4 to v4.20.2

- [#250](https://github.com/Stephane-Pires/caravel/pull/250) [`d5823e3`](https://github.com/Stephane-Pires/caravel/commit/d5823e37c8343bfa4256cf72ff482520b8a59f6f) Thanks [@renovate](https://github.com/apps/renovate)! - chore(backend): 🧹 Update zod from 3.25.63 to v3.25.64

- [#251](https://github.com/Stephane-Pires/caravel/pull/251) [`fa00535`](https://github.com/Stephane-Pires/caravel/commit/fa0053589060a576e07b14c47efe08ceebe8dec3) Thanks [@renovate](https://github.com/apps/renovate)! - chore(backend): 🧹 Update tsx from 4.20.2 to v4.20.3

- [#252](https://github.com/Stephane-Pires/caravel/pull/252) [`09e3ff1`](https://github.com/Stephane-Pires/caravel/commit/09e3ff10cfdf4eb83e7a8a1c2020e39250bc061c) Thanks [@renovate](https://github.com/apps/renovate)! - chore(backend): 🧹 Update scalar monorepo

- [#256](https://github.com/Stephane-Pires/caravel/pull/256) [`5738161`](https://github.com/Stephane-Pires/caravel/commit/5738161bf8b296b6c8c841894a92d377b92de349) Thanks [@renovate](https://github.com/apps/renovate)! - chore(frontend): 🧹 Update @types/node from 22.15.31 to v22.15.32

- [#258](https://github.com/Stephane-Pires/caravel/pull/258) [`431a860`](https://github.com/Stephane-Pires/caravel/commit/431a8608d037d44d17dee55164c03d591d85ce20) Thanks [@renovate](https://github.com/apps/renovate)! - chore(frontend): 🧹 Update zod to v3.25.67

- [#260](https://github.com/Stephane-Pires/caravel/pull/260) [`c17107a`](https://github.com/Stephane-Pires/caravel/commit/c17107a4af2b2f0577a931054b74ea9f4ff11e61) Thanks [@renovate](https://github.com/apps/renovate)! - chore(backend): 🧹 Update scalar monorepo

- [#261](https://github.com/Stephane-Pires/caravel/pull/261) [`e18b6f6`](https://github.com/Stephane-Pires/caravel/commit/e18b6f61f4b05699b2cb66f2766f0f56b4c20a81) Thanks [@renovate](https://github.com/apps/renovate)! - chore(backend): 🧹 Update hono from 4.7.11 to v4.8.2

- [#262](https://github.com/Stephane-Pires/caravel/pull/262) [`c99f915`](https://github.com/Stephane-Pires/caravel/commit/c99f915b87b3014e1c603a28448d74730550038a) Thanks [@renovate](https://github.com/apps/renovate)! - chore(backend): 🧹 Update pg from 8.16.0 to v8.16.2

- [#266](https://github.com/Stephane-Pires/caravel/pull/266) [`154816c`](https://github.com/Stephane-Pires/caravel/commit/154816ce4942958684407612f0d2fb87202c63a2) Thanks [@renovate](https://github.com/apps/renovate)! - chore(backend): 🧹 Pin dependencies

- [#278](https://github.com/Stephane-Pires/caravel/pull/278) [`a0769bf`](https://github.com/Stephane-Pires/caravel/commit/a0769bf70bdfd55cca0f4559889dd98a3dce330a) Thanks [@renovate](https://github.com/apps/renovate)! - chore(backend): 🧹 Update drizzle-kit from 0.31.1 to v0.31.2

- [#284](https://github.com/Stephane-Pires/caravel/pull/284) [`3699539`](https://github.com/Stephane-Pires/caravel/commit/3699539de55dd86382a904b961f21ccb3f017ae5) Thanks [@renovate](https://github.com/apps/renovate)! - chore(app): 🧹 Update node from 22.0.0 to v22.21.1

- [#285](https://github.com/Stephane-Pires/caravel/pull/285) [`7a14bc2`](https://github.com/Stephane-Pires/caravel/commit/7a14bc2fb7dd7524807c3903affb921fd3b82154) Thanks [@renovate](https://github.com/apps/renovate)! - chore(backend): 🧹 Update hono from 4.8.2 to v4.10.7

- [#288](https://github.com/Stephane-Pires/caravel/pull/288) [`4d5dc09`](https://github.com/Stephane-Pires/caravel/commit/4d5dc09f279eaee88c0841ab0bcfea9d11d5eca2) Thanks [@renovate](https://github.com/apps/renovate)! - chore(backend): 🧹 Update scalar monorepo

- [#292](https://github.com/Stephane-Pires/caravel/pull/292) [`c65f220`](https://github.com/Stephane-Pires/caravel/commit/c65f220cd091052917ac3317ed731b893be56af7) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - - [Caravel] : Upgrade to Node v24
  - [Frontend] : Upgrade NextJS to v16
  - [Frontend] : Upgrade Node to v24
  - [Frontend] : Disable some eslint warning via disable-eslint on files or lines
  - [Frontend] : Fix some eslint warning
  - [Backend] : Upgrade Node to v24

- [#290](https://github.com/Stephane-Pires/caravel/pull/290) [`d1090dd`](https://github.com/Stephane-Pires/caravel/commit/d1090dda404a9f37631bba2dd95f1d9f5116404a) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - Make drizzle accessible from Docker

- [#246](https://github.com/Stephane-Pires/caravel/pull/246) [`4b15e95`](https://github.com/Stephane-Pires/caravel/commit/4b15e95d75d88fb25cbfb4976e32d79120cec0d5) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - - [Backend] : Add Scalar UI at /ui
  - [Backend] : Add Openapi at /doc
  - [Backend] : Handle exception

## 0.0.4

### Patch Changes

- [#224](https://github.com/Stephane-Pires/caravel/pull/224) [`da9123f`](https://github.com/Stephane-Pires/caravel/commit/da9123f0c4d5e774f40cc420a13a3386401835ba) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - - (Caravel) : Track changeset and version at root level
  - (Backend) : Update README

## 0.0.3

### Patch Changes

- [#222](https://github.com/Stephane-Pires/caravel/pull/222) [`718f6ae`](https://github.com/Stephane-Pires/caravel/commit/718f6aeeedfa50453310240076c27b137e9e1a44) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - Backend - change to private npm registery

## 0.0.2

### Patch Changes

- [#214](https://github.com/Stephane-Pires/caravel/pull/214) [`f1f292d`](https://github.com/Stephane-Pires/caravel/commit/f1f292d845aee25de3ad7aa20dc809626641f755) Thanks [@renovate](https://github.com/apps/renovate)! - chore(backend): 🧹 Pin dependencies

- [#216](https://github.com/Stephane-Pires/caravel/pull/216) [`d413c0a`](https://github.com/Stephane-Pires/caravel/commit/d413c0aea8fe5942b3dc773ca1aef25fef1800e7) Thanks [@renovate](https://github.com/apps/renovate)! - chore(backend): 🧹 Update @hono/node-server from 1.14.3 to v1.14.4

- [#220](https://github.com/Stephane-Pires/caravel/pull/220) [`7b1ae87`](https://github.com/Stephane-Pires/caravel/commit/7b1ae87237b5f20fbdb55c7f4b0b9a0e2713c35e) Thanks [@renovate](https://github.com/apps/renovate)! - chore(backend): 🧹 Update @types/node from 20.19.0 to v22.15.30

- [#217](https://github.com/Stephane-Pires/caravel/pull/217) [`2b19898`](https://github.com/Stephane-Pires/caravel/commit/2b19898efad6ecc4da5a2ee9d41e03f7fdb03c5d) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - - (App) : Modify documentation
  - (App) : Update Github Release action to pnpm & monorepo

- [#213](https://github.com/Stephane-Pires/caravel/pull/213) [`05c47a8`](https://github.com/Stephane-Pires/caravel/commit/05c47a8eb432f78ed940ff02266ebbde10c91ab5) Thanks [@Stephane-Pires](https://github.com/Stephane-Pires)! - Transform to monorepo
  - Adding backend project
