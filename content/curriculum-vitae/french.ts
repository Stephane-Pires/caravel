export const CURRICULUM_VITAE = {
  ME: {
    id: "ME",
    label: "A propos de moi",
    // icon is to delete once NavigationButton & NavigationCurriculumVitae are deleted
    icon: "TMP-no-icon",
    section: {
      DESCRIPTION: {
        id: "DESCRIPTION",
        label: "Description",
        content: {
          catch_phrases: [
            `Je suis un développeur fullstack qui cherche à approfondir ses compétences backend et infra.`,
            `Je recherche une entreprise qui saura challenger mes compétences`,
          ],
        },
      },
      CONTACT: {
        id: "CONTACT",
        label: "Contact",
        content: {
          phone: "06 74 76 04 90",
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
        duration: {
          start: "Sep 2016",
          end: "Juin 2018",
          difference: "2 ans",
        },
        content: {
          paragraph:
            "After successfully passing the CPGE selection (Classes préparatoires aux grandes écoles), I made the deliberate choice to join ISEP, driven by my profound passion for programming and an unwavering interest in the realm of computers. During my time at ISEP, I delved into various subjects, including computer science, algorithms, project management, networking, and Systems Architecture. The experience proved to be truly captivating and further fueled my enthusiasm for this field.",
          missions: [
            "Première année: Informatique générale",
            "Deuxième année: Spécialisation SI",
          ],

          skills: ["JAVA", "HTML", "CSS", "JAVASCRIPT", "SQL"],
        },
      },
      AUDENCIA: {
        id: "AUDENCIA",
        label: "Audencia",
        icon: "/about-me/audencia-logo.png",
        duration: {
          start: "Sep 2018",
          end: "Aug 2019",
          difference: "1 year",
        },
        content: {
          paragraph:
            "I had the privilege of being selected as one of the few participants in the esteemed double diploma program in Engineering and Management. For my final year of studies, I attended Audencia Business School in Nantes, where I gained extensive knowledge in management-related skills such as finance, accounting, and corporate strategy. This invaluable experience provided me with a comprehensive understanding of corporate perspectives. However, upon graduating, I realized my true passion lay in utilizing my technical expertise. Hence, I decided to follow my heart back to my initial love for computer programming. Since then, I have diligently pursued continuous learning, immersing myself in literature on management practices applied specifically to knowledge-based organizations.",
          missions: [
            "Semestre de management en anglais",
            "Semestre en Business development",
          ],
          skills: [
            "NEGOCIATION",
            "FINANCE",
            "MANAGEMENT",
            "ACCOUNTING",
            "CHANGE_MANAGMENT",
            "BUSINESS_DEVELOPMENT",
          ],
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
        duration: {
          start: "Sep 2019",
          end: "Feb 2023",
          difference: "3+ years",
        },
        content: {
          paragraph:
            "I embarked on my professional journey as a Software Engineer at AnalogWay, where I joined a dynamic team of nine developers. Together, we were entrusted with the development and maintenance of the Web Application that controlled the hardware. My time at AnalogWay proved to be an immensely fulfilling experience, primarily due to the company's robust research and development (R&D) culture. In my first year, I had the privilege of spearheading the implementation and adoption of agile methodologies, revolutionizing our development processes.Throughout my tenure, I actively contributed to the evolution and refinement of these methodologies, continuously seeking ways to improve our efficiency and effectiveness. One notable accomplishment was the successful implementation of an authentication module, enabling controlled access to the Web Application. This endeavor required navigating complex challenges related to real-time communication and screen UI interaction, which significantly enhanced my technical prowess and deepened my understanding of web technologies.",
          missions: [
            "Participation à l'évolution de la WebApp",
            "Protypage d'une fonctionnalité de streaming (WebRTC)",
            "Implémentation d'un module d'authentification",
            "Implémentation et promotion des méthodes agiles (Scrum/Kanban)",
          ],
          skills: ["NODEJS", "TYPESCRIPT", "REACT", "REDUX"],
        },
      },
      IZICREDIT: {
        id: "IZICREDIT",
        label: "Izicrédit",
        icon: "/about-me/izicredit-logo.png",

        duration: {
          start: "Feb 2023",
          end: "Jun 2023",
          difference: "4 month",
        },
        content: {
          paragraph:
            "During my tenure at Izicrédit, I served as a Fullstack Engineer, working alongside a small team of two developers. Our primary focus was to construct a platform catering to lead bank professionals. Additionally, we undertook the development of an Admin dashboard, empowering the product and marketing teams with valuable insights derived from the collected data. Working at Izicrédit presented both intense and captivating challenges. I engaged with a diverse set of technologies, including GraphQL, REST API, E2E Testing, and SQL, in order to deliver new features and develop innovative products. Operating within a startup environment provided me with invaluable experience in rapidly building products from scratch within tight timeframes. This period significantly broadened my perspective on effective project execution and reinforced my ability to transform ideas into reality.",
          missions: [
            "Modélisation via Postgraphil (PostgreSQL + GraphQL)",
            "UI / Algorithmique - Ajout d'un composant traitant les zones de chalandise",
            "Développement de deux dashboards bancaire et administrateur",
            "Développement d'un server de CRON (NodeJS)",
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
    },
  },

  HOBBIES: {
    id: "HOBBIES",
    label: "Loisirs",
    icon: "/about-me/puzzle-piece.svg",
    section: {
      VIDEO_GAME: {
        id: "VIDEO_GAME",
        label: "Art vidéoludique",
        icon: "/about-me/power-blue.svg",
        duration: {
          start: "1998",
          end: "today",
        },
        content: {
          paragraph:
            "Video gaming has been an integral part of my life ever since I can remember. It all began when I was just four years old, playing Age of Empire on my father's personal computer. Since then, my passion for gaming has never waned, and I have explored various platforms such as PC, iPhone, Gameboy Advance, Playstation, and Switch, among others. I have indulged in a diverse range of game genres, including RPGs, JRPGs, MOBAs, MMOs, RTS, FPS, Point & Click, and Platform games Playing online games has been a source of joy and connection, especially when spending time with friends and family who may be physically distant. I believe that video gaming is a wonderful medium for fostering meaningful experiences and relationships. Additionally, my extensive exposure to video games has profoundly influenced my sense of UI/UX design. The interactive nature of gaming has instilled in me a strong appreciation for intuitive user interfaces and engaging user experiences, which I now consider a valuable strength in my professional pursuits.",
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
        label: "Escalade",
        icon: "/about-me/arrow-up-down-blue.svg",
        duration: {
          start: "2022",
          end: "today",
        },
        content: {
          paragraph:
            "In the wake of the Covid pandemic, I felt a strong urge to engage in a physical activity that would not only challenge me but also provide a much-needed escape. It was during this time that I discovered my passion for climbing. Joining the 'Aspala' club in Antony city for a year was an immensely enjoyable experience. The sport captivated me, and I found great fulfillment in pushing my limits and conquering new heights. Currently, I am eagerly seeking a climbing partner who shares my enthusiasm and drive to further excel in this sport. Whether it's bouldering or route climbing, I am open to exploring various aspects of climbing and honing my skills.",
          photos: ["/about-me/climbing.jpeg"],
        },
      },
      BIKING: {
        id: "BIKING",
        label: "Cyclisme",
        icon: "/about-me/map-blue.svg",
        duration: {
          start: "2018",
          end: "today",
        },

        content: {
          paragraph:
            "During my time at Nantes city while studying at Audencia Business School, I discovered a newfound love for biking. I found immense pleasure in commuting to school using my bicycle, relishing the freedom and efficiency it provided. Since then, I have continued to incorporate biking into my daily routine, using it as my preferred mode of transportation. From the chilly snow-covered winters to the scorching summers, I have embraced the elements while pedaling through rain, wind, and sunshine. This experience has reinforced my belief that biking is not only an economical choice but also a remarkably healthy and sustainable means of travel. The physical activity and fresh air that come with biking contribute to both my well-being and environmental consciousness. I am genuinely passionate about promoting biking as an accessible and eco-friendly form of commuting.",
          photos: ["/about-me/bike.jpeg", "/about-me/bike-treasure.jpeg"],
        },
      },
      BOARD_GAME: {
        id: "BOARD_GAME",
        label: "Jeux de société",
        icon: "/about-me/puzzle-piece-blue.svg",
        duration: {
          start: "2018",
          end: "today",
        },
        content: {
          paragraph:
            "Board games have been a constant presence in my life, but recently, I've witnessed a surge in popularity among my relatives. Now, I engage in board game sessions on a weekly, and sometimes even daily, basis with friends, family, and colleagues. I have come to appreciate board games as an exceptional means of breaking the ice and connecting with others. They offer a delightful and interactive way to socialize, fostering a fun and engaging environment.  In many ways, board games excel at facilitating social interaction and building relationships. They create a shared experience that brings people together, encourages teamwork, and sparks conversations. Unlike video games, board games allow for face-to-face interaction, which adds an extra layer of personal connection and authenticity.",
          missions: [
            "Living Forest",
            "Carcasonne",
            "Small World",
            "Azul",
            "Micro Macro",
          ],
        },
      },
    },
  },
} as const

export type Article = keyof typeof CURRICULUM_VITAE

export type SectionKey<T extends Article> = keyof Section<T>

export type Section<T extends Article> = (typeof CURRICULUM_VITAE)[T]["section"]

export function unreachable(x: never): never {
  throw new Error(
    `This codepath is not reachable this variable: ${x} should be handled`
  )
}
