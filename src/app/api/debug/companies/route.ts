import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// Temporär diagnos-route — ta bort efter felsökning
export async function GET(): Promise<NextResponse> {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Ej autentiserad" }, { status: 401 });

  const companies = await prisma.company.findMany({
    include: {
      emailAccount: { select: { email: true, provider: true, expiresAt: true } },
      users: { select: { email: true, role: true } },
    },
  });

  return NextResponse.json({
    sessionCompanyId: session.user.companyId,
    sessionEmail: session.user.email,
    companies: companies.map((c) => ({
      id: c.id,
      name: c.name,
      intakeEmail: c.intakeEmail,
      emailAccount: c.emailAccount
        ? { email: c.emailAccount.email, provider: c.emailAccount.provider, expiresAt: c.emailAccount.expiresAt }
        : null,
      users: c.users,
    })),
  });
}
