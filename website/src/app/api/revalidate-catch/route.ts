import { revalidateTag } from "next/cache";

export async function POST(request: any) {
  try {
    const body = await request.json();
    const { tags } = body;

    revalidateTag(tags);
    return new Response(JSON.stringify({ revalidated: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to revalidate" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
