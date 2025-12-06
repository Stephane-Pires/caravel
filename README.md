# Caravel

![u7161273191_Boat_Ocean_blog_book_bright_colors_cheerful_carav_78754917-23a2-4af1-98de-ff0b23f580e0_0](https://github.com/user-attachments/assets/df74f3b9-a5b7-4a97-b915-4e3856172973)

## Introduction :

_What is this project about ?_

- This project is a my personal blog where you can find :
  - Public article where i write about software engineering (Pattern, Tools, Architecture, Product, Management, etc..)
  - Links to my personal projects
  - Information regarding myself (Curriculum vitae, hobbies, etc..)

## 🚀 How to run ? :

### `devcontainer` :

In order to use [devcontainer](https://code.visualstudio.com/docs/devcontainers/containers) the requirements are :

- [docker](https://www.docker.com/)
- [visual studio code](https://code.visualstudio.com/)
- [dev container extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

Once the requirements are installed, open this repository using vscode.

It should :

- Open it inside a `container`
- Install the project
- Run the frontend under port `3000`

Open [http://localhost:3000](http://localhost:3000)

- Run the backend under port `3001`

Open [http://localhost:3001](http://localhost:3001)

- Run the database under port `5432`

- Run Drizzle Studio under port `3002`

Open [Drizzle Studio](https://local.drizzle.studio)

![gif](/assets/readme/caravel-devcontainer.gif)

#### 📋 Steps done by `devcontainer` :

- run containers via `docker-compose`
- install projects via `pnpm install -r`
- migrate `database` via `db:migrate`

#### 🪴 Seeding

You can `seed` the database via [database/seed](http://localhost:3001/database/seed)

You can `reset` the database via
[database/reset](http://localhost:3001/database/reset)

## 📡 Technologies

_What technologies are you using ?_

### Frontend

This project uses :

- `NextJS` has a metaframework
- `React` has a frontend library
- `Tailwind` for the styling
- `Shadcn` has a UI library
- `Sonner` for Toaster

#### Blog

In order to run the blog i use the `mdx` format with plugins `rehype, retype`. I use the `contentlayer` library to manage the content.

#### Hosting

The hosting is managed by vercel :

- The file serving is DONE using `lambda` functions

### Bakckend

This project uses :

- `Hono` has a server framework
- `PostGRES` has a database
- `Drizzle` has an ORM
- `Zod` has a Schema/validation tool

## Architecture

```mermaid
graph TD;
    subgraph Client
        A[NextJS : frontend] --> B[about-me - CSR]
        A --> D[logbook - SSR]
        A --> E[projects - SSR]
    end

    subgraph Server
        C[api/download/curriculum]
    end

    subgraph Backend
        F[index]
    end

    B --> C
```
