/// <reference types="mdast-util-directive" />

import type { Root } from "mdast";
import { visit } from "unist-util-visit";

// MDXノードの型定義
type MdxNode = {
  type: string;
  children?: MdxNode[];
  value?: string;
  url?: string;
};
// MDXノードをHTML要素に変換する関数
function convertNode(node: MdxNode): {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: unknown[];
  value?: string;
} {
  if (node.type === "link") {
    return {
      type: "element",
      tagName: "a",
      properties: {
        href: node.url,
        className: "text-blue-600 hover:text-blue-800 underline",
      },
      children: node.children?.map(convertNode) || [],
    };
  }
  if (node.type === "text") {
    return {
      type: "text",
      value: node.value || "",
    };
  }
  return node;
}

export default function remarkContainerDirectives() {
  return (tree: Root) => {
    visit(tree, "containerDirective", (node) => {
      if (node.type === "containerDirective" && node.name === "message") {
        const children = (node.children[0] as any).children.map(convertNode);

        node.data = {
          hName: "aside",
          hProperties: {
            className:
              "flex items-start p-4 bg-amber-100 text-white rounded-md",
          },
          hChildren: [
            {
              type: "element",
              tagName: "span",
              properties: {
                className:
                  "min-w-8 min-h-8 mr-2 text-center bg-amber-400 rounded-full",
              },
              children: [{ type: "text", value: "!" }],
            },
            {
              type: "element",
              tagName: "div",
              properties: { className: "" },
              children: [
                {
                  type: "element",
                  tagName: "p",
                  properties: { className: "m-0 text-gray-700" },
                  children: children,
                },
              ],
            },
          ],
        };
      }
    });
  };
}
