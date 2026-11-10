"use server";

import { Vercel } from "@vercel/sdk";
import { db } from "@/lib/db";
import { hostnameMap } from "@/lib/hostname-map";
import { requireTenantAdmin } from "@/lib/session";

const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN });
const PROJECT = process.env.VERCEL_PROJECT_ID!;
const TEAM = process.env.VERCEL_TEAM_ID!;

export async function attachDomain(tenantId: string, hostname: string) {
  const tenant = await requireTenantAdmin(tenantId);
  if (tenant.plan === "free") {
    throw new Error("Custom domains are available on Pro");
  }

  await vercel.projects.addProjectDomain({
    idOrName: PROJECT,
    teamId: TEAM,
    requestBody: { name: hostname },
  });

  await db.domain.create({
    data: { tenantId: tenant.id, hostname, status: "active" },
  });
  await hostnameMap.set(hostname, {
    id: tenant.id,
    slug: tenant.slug,
    plan: tenant.plan,
  });

  return { hostname, dnsTarget: "cname.vercel-dns.com" };
}

export async function waitForVerification(tenantId: string, hostname: string) {
  await requireTenantAdmin(tenantId);

  while (true) {
    const result = await vercel.projects.verifyProjectDomain({
      idOrName: PROJECT,
      teamId: TEAM,
      domain: hostname,
    });
    if (result.verified) {
      return { verified: true };
    }
  }
}

export async function detachDomain(tenantId: string, hostname: string) {
  const tenant = await requireTenantAdmin(tenantId);

  await vercel.projects.removeProjectDomain({
    idOrName: PROJECT,
    teamId: TEAM,
    domain: hostname,
  });
  await db.domain.delete({
    where: { tenantId_hostname: { tenantId: tenant.id, hostname } },
  });

  return { removed: hostname };
}
