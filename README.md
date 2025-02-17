# Caravel

![u7161273191_Boat_Ocean_blog_book_bright_colors_cheerful_carav_78754917-23a2-4af1-98de-ff0b23f580e0_0](https://github.com/user-attachments/assets/df74f3b9-a5b7-4a97-b915-4e3856172973)

## Introduction :

_What is this project about ?_

- This project is a my personal blog where you can find :
  - Public article where i write about software engineering (Pattern, Tools, Architecture, Product, Management, etc..)
  - Links to my personal projects
  - Information regarding myself (Curriculum vitae, hobbies, etc..)


## How to run ? : 

There is 2 ways of running the project :

### 1️⃣ Use a `devcontainer` (prefered way): 

In order to use [devcontainer](https://code.visualstudio.com/docs/devcontainers/containers) the requirements are : 

- [docker](https://www.docker.com/) 
- [visual studio code](https://code.visualstudio.com/)
- [dev container extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

Once the requirements are installed, open this repository using vscode. 

It should : 

- Open it inside a `container`
- Install the project
- Run it on the `3000`

Open [http://localhost:3000](http://localhost:3000) 

![gif](/public/readme/caravel-devcontainer.gif)

### 2️⃣ Basic installation

On the root of the project

Run : 

- `npm install`
- `npm run dev`
- Open [http://localhost:3000](http://localhost:3000)

## Technologies

_What technologies are you using ?_

### Basic 

This project uses :
-  `nextjs` has a metaframework 
- `tailwind` for the styling

### Blog

In order to run the blog i use the `mdx` format with plugins `rehype, retype`. I use the `contentlayer` library to manage the content.

### Hosting

The hosting is managed by vercel :
 - The file serving is DONE using `lambda` functions

## Architecture

_TODO: Define Architecture of the project_

```mermaid
graph TD;
    subgraph Client
        A[User Interface] --> B[Web Browser]
    end

    subgraph Server
        C[Web Server] --> D[Application Server]
        D --> E[Business Logic]
        E --> F[Database]
        E --> G[Cache]
        D --> H[Authentication Service]
    end

    subgraph External Services
        I[Payment Gateway]
        J[Email Service]
        K[Third-Party API]
    end

    B --> C
    D --> I
    D --> J
    D --> K
```