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
      to: "/about",
      isExternal: true,
    },
    {
      name: "X",
      to: "https://x.com/cryptooooon",
      isExternal: true,
    },
    {
      name: "Zenn",
      to: "https://zenn.dev/cryptobox",
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
      name: "X",
      icon: "x-logo",
      to: "https://x.com/cryptooooon",
    },
    {
      name: "Zenn",
      icon: "zenn-logo",
      to: "https://zenn.dev/cryptobox",
    },
    {
      name: "Github",
      icon: "github-logo",
      to: "https://github.com/crypt0box",
    },
  ],
} as const;
