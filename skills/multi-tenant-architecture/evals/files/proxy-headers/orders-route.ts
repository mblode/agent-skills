// app/api/orders/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const tenantId = request.headers.get("x-tenant-id");
  if (!tenantId) {
    return NextResponse.json({ error: "No store selected" }, { status: 400 });
  }

  const status = request.nextUrl.searchParams.get("status") ?? "open";
  const orders = await db.order.findMany({
    where: { tenantId, status },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      number: true,
      customerEmail: true,
      shippingAddress: true,
      totalCents: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ orders });
}
