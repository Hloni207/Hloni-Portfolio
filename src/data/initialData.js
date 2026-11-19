export const initialPortfolioData = {
  profile: {
    name: "hloni.",
    fullName: "Hloni",
    titleTag: "Welcome to my personal Portfolio",
    bio: "I'm Hloni — a product builder and robotics enthusiast connecting engineering, software and emerging tech to create meaningful products and experiences.",
    avatar: "/media/profileimage.jpg",
    headlinePart1: "Comming to",
    headlinePart2: "Know Me.",
    resumeUrl: "/sample-resume.pdf",
    resumeFilename: "Hloni_Resume.pdf",
  },
  
  projectsSection: {
    sectionTag: "01 / PORTFOLIO",
    title: "Selected work.",
    subtitle: "View my workd and projects",
  },

  // 9. delete all the selected work and leave empty space to be filled now
  projects: [],

  experienceSection: {
    sectionTag: "02 / BACKGROUND",
    title: "Built through experience.",
    subtitle: "From industrial engineering and robotics to software systems, combining hands-on technical execution with continuous curiosity.",
  },

  // 8. remove the OverIT, apple, infrate, meta and google experiences
  experiences: [
    {
      id: "exp-1",
      number: "01",
      name: "Lumotech",
      position: "Shaddower, Maintanance Department Assistance",
      date: "2026 — June",
      description: "Worked at Lumotech in the maintenance department as a shadower and maintenance assistant during the June holidays. Gained practical experience troubleshooting automotive lighting industrial assembly lines, assisting senior mechanical engineers, and maintaining automated electrical machines.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "exp-2",
      number: "02",
      name: "Robo Rumble (Soweto)",
      position: "Second Place Winner & Robotics Competitor",
      date: "2026",
      description: "Attended my first ever robotics competition in Soweto (Robo Rumble). Designed and tuned robot hardware under tight time constraints, reaching the finals and securing 2nd place overall.",
      image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "exp-3",
      number: "03",
      name: "W3node Hackathon (Cape Town)",
      position: "Hackathon Participant & Builder",
      date: "2026",
      description: "Traveled to Cape Town to compete in the W3node Hackathon. Built prototype software integrations and connected IoT hardware with decentralized protocols over an intense sprint.",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80",
    }
  ],

  aboutSection: {
    sectionTag: "03 / ABOUT",
    headingLines: [
      "A Robotist man,",
      "A productive mind,",
      "An explorer"
    ],
    paragraph1: "My career began with Programming and Robotics. It tow me from being a person living for the day to being a thinker and builder. I began building small robot prototype in class until i started doing it at home.",
    paragraph2: "Curiosity sparked, followed by the love of learning, i ended up starting to explorer more. i started my journey when i worked at a local industrial company in 2026 June holidays as a shadower then Maintance Assistance, sadly i went back to college. curisority though did not end there, i continued by attending my first ever competiton in Soweto (Robo Rumble) where i came out second and went to W3node Hackathon in Cape Town.",
    paragraph3: "Now i am a student, a builder, and a curious person striving to make use of everyday i live. with a mind to always become the better version of myself.",
  },

  skills: [
    { id: "sk-1", name: "Mobile App development", category: "Software" },
    { id: "sk-2", name: "Website Development", category: "Software" },
    { id: "sk-3", name: "IOT (Internet Of Things) Engineer", category: "Hardware" },
    { id: "sk-4", name: "Electrical Engineer", category: "Engineering" },
    { id: "sk-5", name: "Microsoft Office", category: "Productivity" },
    { id: "sk-6", name: "Github", category: "Tools" }
  ],

  contactSection: {
    sectionTag: "05 / CONTACT ME",
    title: "Let's\nbuild something.",
    subtitle: "get in touch to build and find out more with me",
    buttonText: "Get in touch",
    copyright: "© 2026 Hloni",
  },

  // 4, 5, 6, 7. Updated contact links with specific user links
  contactLinks: [
    {
      id: "cnt-1",
      name: "GitHub",
      url: "https://github.com/Hloni207",
      displayUrl: "github.com/Hloni207",
      icon: "github",
      iconUrl: "",
      color: "#ffffff"
    },
    {
      id: "cnt-2",
      name: "LinkedIn",
      url: "https://www.linkedin.com/qr/AQChO78MFhaFtM37YC1TUAy4KVGabdZNbbo2W9RvX_HQZzZyHq1aNdpwyZSiQq2MwGxMtQg1g_670-vqD-gWkZJFByvl4uSTffc",
      displayUrl: "linkedin.com/in/hloni",
      icon: "linkedin",
      iconUrl: "",
      color: "#0a66c2"
    },
    {
      id: "cnt-3",
      name: "WhatsApp",
      url: "https://wa.me/27640075521",
      displayUrl: "064 007 5521",
      icon: "message-circle",
      iconUrl: "",
      color: "#25d366"
    },
    {
      id: "cnt-4",
      name: "Email",
      url: "mailto:rachoshithlonolofatso@gmail.com",
      displayUrl: "rachoshithlonolofatso@gmail.com",
      icon: "mail",
      iconUrl: "",
      color: "#ea4335"
    }
  ]
};
