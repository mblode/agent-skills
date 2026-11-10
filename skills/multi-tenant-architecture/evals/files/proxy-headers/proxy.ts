import { NextResponse, type NextRequest } from "next/server";
import { lookupTenantByHost } from "./lib/tenants";

const BRAND_HOSTS = new Set(["marketstall.com", "www.marketstall.com"]);

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = (request.headers.get("host") ?? "").toLowerCase().replace(/:\d+$/, "");

  if (url.pathname.startsWith("/.well-known") || url.pathname === "/api/health") {
    return NextResponse.next();
  }

  if (BRAND_HOSTS.has(host)) {
    return NextResponse.next();
  }

  const tenant = await lookupTenantByHost(host);
  if (!tenant) {
    url.pathname = "/marketing";
    return NextResponse.rewrite(url);
  }

  const headers = new Headers(request.headers);
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
