/* eslint-disable sort-keys */
/* eslint-disable max-lines */

export const CURRICULUM_VITAE = {
  ME: {
    id: "ME",
    label: "About me",
    // icon is to delete once NavigationButton & NavigationCurriculumVitae are deleted
    icon: "TMP-no-icon",
    section: {
      DESCRIPTION: {
        id: "DESCRIPTION",
        label: "Description",
        content: {
          catch_phrases: [
            `Senior software engineer bridging product and tech.`,
            `I take products from client interviews to production, and measure that they got better.`,
          ],
        },
      },
      CONTACT: {
        id: "CONTACT",
        label: "Contact",
        content: {
          email: "pires.stephane.pro@gmail.com",
          site: "https://caravel-mocha.vercel.app/",
        },
      },
    },
  },
  EDUCATION: {
    id: "EDUCATION",
    label: "Education",
    icon: "/about-me/academic.svg",
    section: {
      ISEP: {
        id: "ISEP",
        label: "Isep",
        icon: "/about-me/isep-logo.png",
        link: "https://en.isep.fr/",
        duration: {
          start: "Sep 2016",
          end: "Jun 2018",
          difference: "2 years",
        },
        content: {
          paragraph:
            "Engineering school after the CPGE: computer science, then information systems architecture.",
        },
      },
      AUDENCIA: {
        id: "AUDENCIA",
        label: "Audencia",
        icon: "/about-me/audencia-logo.png",
        link: "https://www.audencia.com/",
        duration: {
          start: "Sep 2018",
          end: "Aug 2019",
          difference: "1 year",
        },
        content: {
          paragraph:
            "Double degree in engineering and management: a final year in business school (finance, strategy, management).",
        },
      },
    },
  },
  EXPERIENCE: {
    id: "EXPERIENCE",
    label: "Experience",
    icon: "/about-me/computer-desktop.svg",
    section: {
      ANALOG_WAY: {
        id: "ANALOG_WAY",
        label: "Analog Way",
        icon: "/about-me/analogway-logoo.png",
        link: "https://www.analogway.com/americas/",
        duration: {
          start: "Sep 2019",
          end: "Feb 2023",
          difference: "3+ years",
        },
        content: {
          paragraph:
            "First role, in a team of nine building the web app that controls Analog Way's video hardware in real time.",
          missions: [
            "Led the team's adoption of Scrum and Kanban in my first year",
            "Built the authentication module that restricts platform access",
            "Built real-time UI features in React/Redux and prototyped WebRTC",
          ],
          skills: ["TYPESCRIPT", "REACT", "REDUX", "NODEJS"],
        },
      },
      // Izicrédit is hidden from the CV for now: remove the comment markers (and the one in about-me/page.tsx) to show it again
      /*
      IZICREDIT: {
        id: "IZICREDIT",
        label: "Izicrédit",
        icon: "/about-me/izicredit-logo.png",
        link: "https://www.izicredit.com/",
        duration: {
          start: "Feb 2023",
          end: "Jun 2023",
          difference: "4 month",
        },
        content: {
          paragraph:
            "During my tenure at Izicrédit, I served as a Fullstack Engineer, working alongside a small team of two developers. Our primary focus was to construct a platform catering to lead bank professionals. Additionally, we undertook the development of an Admin dashboard, empowering the product and marketing teams with valuable insights derived from the collected data. Working at Izicrédit presented both intense and captivating challenges. I engaged with a diverse set of technologies, including GraphQL, REST API, E2E Testing, and SQL, in order to deliver new features and develop innovative products. Operating within a startup environment provided me with invaluable experience in rapidly building products from scratch within tight timeframes. This period significantly broadened my perspective on effective project execution and reinforced my ability to transform ideas into reality.",
          missions: [
            "Added relation to database using Postgraphil (PostgreSQL+ GraphQL)",
            "UI / Algorithm : Building of an Input managing catchment area",
            "Development from A to Z of an Admin Dashboard and Bank Dashboard",
            "Development of a CRON server using NodeJS",
          ],
          skills: [
            "NODEJS",
            "TYPESCRIPT",
            "REACT",
            "GRAPHQL",
            "NEXTJS",
            "POSTGRESQL",
          ],
        },
      },
      */
      LEAKMITED: {
        id: "LEAKMITED",
        label: "Leakmited",
        icon: "/about-me/leakmited-logo.png",
        link: "https://www.leakmited.com/",
        duration: {
          start: "Sep 2023",
          end: "Mar 2026",
          difference: "2+ years",
        },
        content: {
          paragraph:
            "Joined a 7-person water-tech startup that grew to 20+ and raised a €5M Series A. I built products that help utilities find leaks in drinking-water networks.",
          missions: [
            "Built Sentinel from scratch, shaped by client visits with field teams",
            "Introduced design docs, schema validation (Zod, Pydantic) and a Storybook component library",
            "Built the ETL pipelines (Databricks) that feed the data warehouse",
          ],
          skills: ["TYPESCRIPT", "SVELTEKIT", "PYTHON", "POSTGRESQL", "AWS"],
        },
      },
      FIGURES: {
        id: "FIGURES",
        label: "Figures",
        icon: "/about-me/figures-logo.png",
        link: "https://figures.hr/",
        duration: {
          start: "May 2026",
          end: "Oct 2026",
          difference: "6 months",
        },
        content: {
          paragraph:
            "Senior Software Engineer at a pay-transparency platform. I owned the Salary Bands module end to end, from product decisions to performance, for 100+ clients.",
          missions: [
            "Cut page load by ~60% (p75 FCP 4s → 1.5s) and brought 98% of API calls under 1s",
            "Built DataHealth from scratch: HR-connector data is validated before it reaches customers",
            "Set up monitoring as code (Datadog + Terraform), adopted by the team",
          ],
          skills: [
            "TYPESCRIPT",
            "TERRAFORM",
            "DATADOG",
            "ARTIFICIAL_INTELLIGENCE",
          ],
        },
      },
    },
  },

  HOBBIES: {
    id: "HOBBIES",
    label: "Hobbies",
    icon: "/about-me/puzzle-piece.svg",
    section: {
      VIDEO_GAME: {
        id: "VIDEO_GAME",
        label: "Video games",
        icon: "/about-me/power-blue.svg",
        duration: {
          start: "1998",
          end: "today",
        },
        content: {
          paragraph:
            "Since Age of Empires at four. Games shaped my eye for UI and UX.",
          missions: [
            "Final Fantasy VII",
            "Rayman",
            "Monkey Island",
            "Celeste",
            "Starcraft",
          ],
        },
      },
      CLIMBING: {
        id: "CLIMBING",
        label: "Climbing",
        icon: "/about-me/arrow-up-down-blue.svg",
        duration: {
          start: "2022",
          end: "today",
        },
        content: {
          paragraph:
            "Bouldering and routes since 2022. Always looking for a climbing partner.",
          photos: ["/about-me/climbing.jpeg"],
        },
      },
      BIKING: {
        id: "BIKING",
        label: "Biking",
        icon: "/about-me/map-blue.svg",
        duration: {
          start: "2018",
          end: "today",
        },

        content: {
          paragraph: "My daily transport since 2018, rain or shine.",
          photos: ["/about-me/bike.jpeg", "/about-me/bike-treasure.jpeg"],
        },
      },
      BOARD_GAME: {
        id: "BOARD_GAME",
        label: "Board game",
        icon: "/about-me/puzzle-piece-blue.svg",
        duration: {
          start: "2018",
          end: "today",
        },
        content: {
          paragraph:
            "Weekly sessions with friends, family and colleagues: the best icebreaker.",
          missions: [
            "Living Forest",
            "Carcassonne",
            "Small World",
            "Azul",
            "Micro Macro",
          ],
        },
      },
    },
  },
  PROJECTS: {
    id: "PROJECTS",
    label: "Projects",
    icon: "no-icon-for-now",
    section: {
      CARAVEL: {
        id: "CARAVEL",
        label: "Caravel",
        icon: "/projects/caravel.png",
        url: "https://caravel-mocha.vercel.app/",
        duration: {
          start: "19 April 2023",
          end: "On going",
        },
        content: {
          skills: ["NEXTJS", "REACT", "TAILWIND", "NODEJS"],
        },
      },
      VENTUS: {
        id: "Ventus",
        label: "Ventus",
        icon: "/projects/ventus.png",
        url: "https://ventus-jade.vercel.app/1",
        duration: {
          start: "7 September 2022",
          end: "24 July 2023",
        },
        content: {
          skills: ["VUE", "VITE", "WINDICSS"],
        },
      },
      ABRACADABRA: {
        id: "Abracadabra",
        label: "Abracadabra",
        icon: "/projects/abracadabra.jpg",
        url: "https://github.com/Stephane-Pires/abracadabra",
        duration: {
          start: "Novembre 2024",
          end: "On going",
        },
        content: {
          skills: ["ANSIBLE", "LINUX", "TERMINAL"],
        },
      },
      FARAWAY: {
        id: "Faraway",
        label: "Faraway",
        icon: "/projects/faraway.png",
        url: "https://faraway-solver.com",
        duration: {
          start: "January 2026",
          end: "On going",
        },
        content: {
          skills: [
            "SVELTE",
            "SVELTEKIT",
            "AWS",
            "COMPUTER_VISION",
            "PYTHON",
            "SERVERLESS",
          ],
        },
      },
    },
  },
} as const

export type Article = keyof typeof CURRICULUM_VITAE

export type SectionKey<T extends Article> = keyof Sections<T>

export type Sections<T extends Article> =
  (typeof CURRICULUM_VITAE)[T]["section"]

export function unreachable(x: never): never {
  throw new Error(
    `This codepath is not reachable this variable: ${x} should be handled`,
  )
}
