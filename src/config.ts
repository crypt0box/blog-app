export const siteConfig = {
  menu: [
    {
      name: "HOME",
      to: "/",
      isExternal: false,
    },
    {
      name: "ABOUT",
      to: "/about",
      isExternal: false,
    },
    {
      name: "CONTACT",
      to: "https://forms.gle/MPiaTEv779uF8hE36",
      isExternal: true,
    },
    {
      name: "Github",
      to: "https://github.com/crypt0box",
      isExternal: true,
    },
  ],
} as const;

export const profileConfig = {
  links: [
    {
      name: "rss",
      icon: "rss-logo",
      to: "/rss.xml",
    },
    {
      name: "Github",
      icon: "github-logo",
      to: "https://github.com/crypt0box",
    },
  ],
} as const;
