import { NextResponse, type NextRequest } from "next/server";
import { lookupTenantByHost } from "./lib/tenants";

const BRAND_HOSTS = new Set(["tessel.com", "www.tessel.com"]);

function withoutTenantHeaders(request: NextRequest): Headers {
  const headers = new Headers(request.headers);
  for (const name of [...headers.keys()]) {
    if (name.toLowerCase().startsWith("x-tenant-")) {
      headers.delete(name);
    }
  }
  return headers;
}

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = (request.headers.get("host") ?? "").toLowerCase().replace(/:\d+$/, "");
  const headers = withoutTenantHeaders(request);

  if (url.pathname.startsWith("/.well-known")) {
    return NextResponse.next({ request: { headers } });
  }

  if (BRAND_HOSTS.has(host)) {
    return NextResponse.next({ request: { headers } });
  }

  const tenant = await lookupTenantByHost(host);
  if (!tenant || tenant.hostname !== host) {
    return new NextResponse("Not found", { status: 404 });
  }

  headers.set("x-tenant-id", tenant.id);
  headers.set("x-tenant-slug", tenant.slug);
  headers.set("x-tenant-plan", tenant.plan);

  if (!url.pathname.startsWith("/api/")) {
    url.pathname = `/t/${tenant.slug}${url.pathname}`;
  }
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
