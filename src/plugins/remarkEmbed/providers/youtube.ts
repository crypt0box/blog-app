import type { RootContent } from "mdast";
import type { EmbedProvider } from "./types";

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

  if (host !== "youtube.com") return null;

  if (parsed.pathname === "/watch") {
    const id = parsed.searchParams.get("v");
    return id && YOUTUBE_ID_RE.test(id) ? id : null;
  }

  const shortsMatch = parsed.pathname.match(/^\/shorts\/([^/]+)$/);
  if (!shortsMatch) return null;

  return YOUTUBE_ID_RE.test(shortsMatch[1]) ? shortsMatch[1] : null;
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

const youtubeProvider: EmbedProvider = {
  createNode(url) {
    const videoId = extractYouTubeId(url);
    return videoId ? buildEmbedNode(videoId) : null;
  },
};

export default youtubeProvider;
