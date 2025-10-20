import { type CollectionEntry, getCollection, getEntry } from "astro:content";
import type { APIContext } from "astro";
import { getOgImage } from "../../components/OgImage";

type Props = CollectionEntry<"blog">;

export async function getStaticPaths() {
  const posts = await getCollection("blog");

  return posts.map((post) => ({
    params: { id: post.id },
  }));
}

export async function GET({ params }: APIContext) {
  const post = await getEntry("blog", params.id as Props["id"]);
  const buf = await getOgImage(post?.data.title ?? "No title");
  const bytes = new Uint8Array(buf);

  return new Response(bytes, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
