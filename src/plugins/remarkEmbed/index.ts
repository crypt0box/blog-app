import type { Paragraph, PhrasingContent, Root, RootContent } from "mdast";
import { visit } from "unist-util-visit";
import linkCardProvider from "./providers/linkCard";
import type { EmbedProvider } from "./providers/types";
import youtubeProvider from "./providers/youtube";

const providers: EmbedProvider[] = [youtubeProvider, linkCardProvider];

function getAutolinkedUrl(node: PhrasingContent): string | null {
  if (node.type !== "link" || node.children.length !== 1) return null;

  const inner = node.children[0];
  if (inner.type !== "text" || inner.value !== node.url) return null;

  return node.url;
}

function splitParagraph(
  paragraph: Paragraph,
  createEmbed: (url: string) => RootContent | null,
): RootContent[] | null {
  const children = [...paragraph.children];
  const output: RootContent[] = [];
  let buffer: PhrasingContent[] = [];
  let foundEmbed = false;

  const flushBuffer = () => {
    while (buffer[0]?.type === "text" && buffer[0].value === "") {
      buffer.shift();
    }
    while (
      buffer.at(-1)?.type === "text" &&
      (buffer.at(-1) as { value: string }).value === ""
    ) {
      buffer.pop();
    }

    if (buffer.length === 0) return;

    output.push({ type: "paragraph", children: buffer });
    buffer = [];
  };

  for (let index = 0; index < children.length; index += 1) {
    const child = children[index];
    const url = getAutolinkedUrl(child);
    const previous = buffer.at(-1);
    const next = children[index + 1];
    const startsLine =
      !previous || (previous.type === "text" && previous.value.endsWith("\n"));
    const endsLine =
      !next || (next.type === "text" && next.value.startsWith("\n"));
    const embed = url && startsLine && endsLine ? createEmbed(url) : null;

    if (!embed) {
      buffer.push(child);
      continue;
    }

    if (previous?.type === "text") {
      previous.value = previous.value.replace(/\n$/, "");
    }

    flushBuffer();
    output.push(embed);
    foundEmbed = true;

    if (next?.type === "text") {
      children[index + 1] = { ...next, value: next.value.replace(/^\n/, "") };
    }
  }

  flushBuffer();
  return foundEmbed ? output : null;
}

export default function remarkEmbed() {
  return (tree: Root) => {
    const usedProviders = new Set<EmbedProvider>();
    let embedIndex = 0;

    const createEmbed = (url: string): RootContent | null => {
      for (const provider of providers) {
        const node = provider.createNode(url, { index: embedIndex });
        if (!node) continue;

        usedProviders.add(provider);
        embedIndex += 1;
        return node;
      }

      return null;
    };

    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || typeof index !== "number") return;

      const replacement = splitParagraph(node, createEmbed);
      if (!replacement) return;

      (parent.children as RootContent[]).splice(index, 1, ...replacement);
      return index + replacement.length;
    });

    for (const provider of usedProviders) {
      if (provider.createAssets) {
        tree.children.push(...provider.createAssets());
      }
    }
  };
}
