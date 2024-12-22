/// <reference types="mdast-util-directive" />

import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export default function remarkContainerDirectives() {
  return (tree: Root) => {
    visit(tree, "containerDirective", (node) => {
      if (node.type === "containerDirective" && node.name === "message") {
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
                  children: [
                    {
                      type: "text",
                      value: (node.children[0] as any).children[0].value,
                    },
                  ],
                },
              ],
            },
          ],
        };
      }
    });
  };
}
