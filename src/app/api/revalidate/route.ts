import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getRevalidationSecret } from "@/config/env";

/**
 * Called by ruvaya-admin-api after content changes (products, collections,
 * homepage, navigation, policies, campaigns) to bust the storefront's fetch
 * cache. Protected by a shared secret that never reaches the browser.
 *
 * Body: { secret: string; tags?: string[]; paths?: string[] } — ruvaya-admin-api's
 * revalidateStorefront() always sends these as arrays; the singular `tag`/`path`
 * are also accepted for any other caller.
 * Recognised tags (used across lib/api/*): "homepage", "storefront-config",
 * "navigation", "products", "product:<slug>", "collections",
 * "collection:<slug>", "campaigns", "campaign:<slug>", "reviews",
 * "reviews:<productId>".
 */
export async function POST(request: NextRequest) {
  let body: { secret?: string; tag?: string; path?: string; tags?: string[]; paths?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Invalid JSON body" } }, { status: 400 });
  }

  let expectedSecret: string;
  try {
    expectedSecret = getRevalidationSecret();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Revalidation is not configured on this deployment." } },
      { status: 500 },
    );
  }

  if (!body.secret || body.secret !== expectedSecret) {
    return NextResponse.json({ success: false, error: { code: "AUTH_EXPIRED", message: "Invalid revalidation secret." } }, { status: 401 });
  }

  // ruvaya-admin-api's revalidateStorefront() always sends `tags`/`paths` as
  // arrays; `tag`/`path` are kept for backward compatibility with any other caller.
  const tags = [...(body.tags ?? []), ...(body.tag ? [body.tag] : [])];
  const paths = [...(body.paths ?? []), ...(body.path ? [body.path] : [])];

  if (!tags.length && !paths.length) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Provide `tags`/`tag` or `paths`/`path` to revalidate." } },
      { status: 400 },
    );
  }

  for (const tag of tags) revalidateTag(tag, "max");
  for (const path of paths) revalidatePath(path);

  return NextResponse.json({ success: true, data: { revalidated: true, tags, paths } });
}
