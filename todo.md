# TODO

- [x] : Architecture

  - [x] : Blog => (dynamique) inspiration-articles ==> (logbook)

  - [x] : Landing page

  - [x] : Navbar

- [ ] : Add/Create a storybook - it should be a separated projet called "Compass" this storybook will act has a Design system tool

- [x] : Create intermediary component for the "about-me" for exemple "Section"

- [ ] : Find assets for Star components

- [x] : Find a logo

- [ ] : Defines features, mock-up them

  - [x] : Star Component

- [ ] : Use tailwind.config.js to customize design system

  - [x] : Define Fonts to use (Font for Header, font for Text, font for Code)

  - [x] : Define Colors

  - [ ] : Define Spacing

- [x] : Add linting rules (tailwind, mdx)

- [x] : Customize Markdown HTML balises

- [x] : Try [contentLayer](https://www.contentlayer.dev/) or [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)

- [ ] : Consider using a Storybook pour elements (card, typography, spacing, navigation, links, colors, header, footer, tooltip, etc...)

- [ ] : Restrein access to "Sandbox" with authentification (check what can be done with nextJS)

- [x] : Consider using https://pdfme.com/docs/getting-started for pdf manipulation and generation

- [x] : Create a route on the API to serve the pdf.

- [ ] : Make the 404 page mobile friendly

  - [ ] : 404 page makes navigation un-interactive fix it

- [x] : Use Error Boundary (error.ts in NextJS)

  - [ ] : A feature with error Boundary is available in a Stash, sadly it's inconsistant. Wait for futur version of nextjs to retry it. (Errors doesn't seems to be catched properly has of versio of today 13.3.x)

- [ ] : Use Loading (loading.ts in NextJS)

- [ ] : Reactivate the cache for the PDF once PDF is stabilased

- [ ] : Investigate Typing for "SectionContent" explicitly the missmatch between the curriculum model "as const | readonly" and the Props of the component

- [ ] : Update dependencies to solve various problems (not-found.tsx that don't redirect with Link, error.tsx that doesn't trigger on throw error, contentlayer that brings vulnaribility, etc...)

- [x] : pin with volta
