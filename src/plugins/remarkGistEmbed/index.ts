import type { Paragraph, Root, RootContent } from "mdast";
import { visit } from "unist-util-visit";

const GIST_ID_RE = /^[0-9a-f]+$/i;

type Gist = {
  url: string;
  owner: string;
  id: string;
};

function getGist(url: string): Gist | null {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  if (parsed.hostname !== "gist.github.com") return null;

  const pathParts = parsed.pathname.split("/").filter(Boolean);
  if (pathParts.length !== 2) return null;

  const [owner, gistId] = pathParts;
  if (!owner || !gistId || !GIST_ID_RE.test(gistId)) return null;

  return {
    url: `https://gist.github.com/${owner}/${gistId}`,
    owner,
    id: gistId,
  };
}

function getStandaloneUrl(paragraph: Paragraph): string | null {
  if (paragraph.children.length !== 1) return null;

  const child = paragraph.children[0];
  if (child.type !== "link" || child.children.length !== 1) return null;

  const inner = child.children[0];
  if (inner.type !== "text" || inner.value !== child.url) return null;

  return child.url;
}

function buildEmbedNode(gist: Gist, cardId: string): RootContent {
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
            "data-content": gist.url,
            title: `GitHub Gist preview: ${gist.owner}/${gist.id}`,
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

export default function remarkGistEmbed() {
  return (tree: Root) => {
    let cardCount = 0;

    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || typeof index !== "number") return;

      const url = getStandaloneUrl(node);
      const gist = url ? getGist(url) : null;
      if (!gist) return;

      const cardId = `gist-card-${gist.id}-${cardCount}`;
      cardCount += 1;

      (parent.children as RootContent[]).splice(
        index,
        1,
        buildEmbedNode(gist, cardId),
      );
    });

    if (cardCount > 0) {
      tree.children.push(buildListenerNode());
    }
  };
}
