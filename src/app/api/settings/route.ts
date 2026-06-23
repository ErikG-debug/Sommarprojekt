import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(): Promise<NextResponse> {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Ej autentiserad" }, { status: 401 });

  const company = await prisma.company.findUnique({
    where: { id: session.user.companyId },
    select: { signature: true, aiSignature: true },
  });

  return NextResponse.json({
    signature: company?.signature ?? "",
    aiSignature: company?.aiSignature ?? "",
  });
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Ej autentiserad" }, { status: 401 });

  const body = await req.json();
  const allowed = ["signature", "aiSignature"] as const;
  type AllowedKey = (typeof allowed)[number];

  const data: Partial<Record<AllowedKey, string>> = {};
  for (const key of allowed) {
    if (key in body && typeof body[key] === "string") {
      data[key] = body[key];
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Inga giltiga fält" }, { status: 400 });
  }

  await prisma.company.update({
    where: { id: session.user.companyId },
    data,
  });

  return NextResponse.json({ ok: true });
}
