import type { RootContent } from "mdast";

export type EmbedContext = {
  index: number;
};

export type EmbedProvider = {
  createNode: (url: string, context: EmbedContext) => RootContent | null;
  createAssets?: () => RootContent[];
};
