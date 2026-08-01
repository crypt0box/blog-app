import type { RootContent } from "mdast";
import type { EmbedProvider } from "./types";

function getHttpUrl(url: string): URL | null {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  return parsed.protocol === "http:" || parsed.protocol === "https:"
    ? parsed
    : null;
}

function buildCardNode(url: URL, cardId: string): RootContent {
  return {
    type: "paragraph",
    children: [],
    data: {
      hName: "div",
      hProperties: {
        className: "not-prose my-4",
      },
      hChildren: [
        {
          type: "element",
          tagName: "iframe",
          properties: {
            src: `https://embed.zenn.studio/card#${cardId}`,
            id: cardId,
            "data-content": url.href,
            title: `Link preview: ${url.hostname}`,
            className: "w-full rounded-md",
            frameBorder: "0",
            height: "160",
            scrolling: "no",
            loading: "lazy",
          },
          children: [],
        },
      ],
    },
  };
}

function buildListenerNode(): RootContent {
  return {
    type: "paragraph",
    children: [],
    data: {
      hName: "script",
      hProperties: {
        src: "https://embed.zenn.studio/js/listen-embed-event.js",
      },
      hChildren: [],
    },
  };
}

const linkCardProvider: EmbedProvider = {
  createNode(url, context) {
    const parsed = getHttpUrl(url);
    if (!parsed) return null;

    return buildCardNode(parsed, `link-card-${context.index}`);
  },
  createAssets() {
    return [buildListenerNode()];
  },
};

export default linkCardProvider;
