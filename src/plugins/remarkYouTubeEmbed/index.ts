import type { Root, Paragraph, PhrasingContent, RootContent } from "mdast";
import { visit } from "unist-util-visit";

const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/;

function extractYouTubeId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1);
    return YOUTUBE_ID_RE.test(id) ? id : null;
  }

  if (host === "youtube.com") {
    if (parsed.pathname === "/watch") {
      const id = parsed.searchParams.get("v");
      return id && YOUTUBE_ID_RE.test(id) ? id : null;
    }
    const shortsMatch = parsed.pathname.match(/^\/shorts\/([^/]+)$/);
    if (shortsMatch) {
      return YOUTUBE_ID_RE.test(shortsMatch[1]) ? shortsMatch[1] : null;
    }
  }

  return null;
}

function getAutolinkedUrl(node: PhrasingContent): string | null {
  if (node.type !== "link") return null;
  if (node.children.length !== 1) return null;
  const inner = node.children[0];
  if (inner.type !== "text") return null;
  if (inner.value !== node.url) return null;
  return node.url;
}

function buildEmbedNode(videoId: string): RootContent {
  return {
    type: "paragraph",
    children: [],
    data: {
      hName: "div",
      hProperties: {
        className: "relative w-full my-4",
        style: "aspect-ratio: 16 / 9;",
      },
      hChildren: [
        {
          type: "element",
          tagName: "iframe",
          properties: {
            src: `https://www.youtube.com/embed/${videoId}`,
            title: "YouTube video player",
            frameBorder: "0",
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
            referrerPolicy: "strict-origin-when-cross-origin",
            allowFullScreen: true,
            className: "absolute inset-0 w-full h-full rounded-md",
          },
          children: [],
        },
      ],
    },
  };
}

function splitParagraph(paragraph: Paragraph): RootContent[] | null {
  const children = [...paragraph.children];
  const out: RootContent[] = [];
  let buffer: PhrasingContent[] = [];
  let foundEmbed = false;

  const flushBuffer = () => {
    while (
      buffer.length > 0 &&
      buffer[0].type === "text" &&
      buffer[0].value === ""
    ) {
      buffer.shift();
    }
    while (
      buffer.length > 0 &&
      buffer[buffer.length - 1].type === "text" &&
      (buffer[buffer.length - 1] as { value: string }).value === ""
    ) {
      buffer.pop();
    }
    if (buffer.length > 0) {
      out.push({ type: "paragraph", children: buffer });
      buffer = [];
    }
  };

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const url = getAutolinkedUrl(child);
    const videoId = url ? extractYouTubeId(url) : null;

    if (!videoId) {
      buffer.push(child);
      continue;
    }

    const prev = buffer[buffer.length - 1];
    const next = children[i + 1];
    const prevOk =
      !prev ||
      (prev.type === "text" && prev.value.endsWith("\n"));
    const nextOk =
      !next || (next.type === "text" && next.value.startsWith("\n"));

    if (!prevOk || !nextOk) {
      buffer.push(child);
      continue;
    }

    if (prev && prev.type === "text") {
      prev.value = prev.value.replace(/\n$/, "");
    }
    flushBuffer();
    out.push(buildEmbedNode(videoId));
    foundEmbed = true;

    if (next && next.type === "text") {
      children[i + 1] = { ...next, value: next.value.replace(/^\n/, "") };
    }
  }

  flushBuffer();

  return foundEmbed ? out : null;
}

export default function remarkYouTubeEmbed() {
  return (tree: Root) => {
    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || typeof index !== "number") return;
      const replacement = splitParagraph(node);
      if (!replacement) return;
      (parent.children as RootContent[]).splice(index, 1, ...replacement);
      return index + replacement.length;
    });
  };
}
