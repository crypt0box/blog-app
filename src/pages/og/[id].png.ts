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
  const body = await getOgImage(post?.data.title ?? "No title");

  return new Response(body);
}
