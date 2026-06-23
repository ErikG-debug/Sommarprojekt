import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as never);

async function main() {
  const companies = await prisma.company.findMany({
    include: {
      emailAccount: { select: { email: true, expiresAt: true } },
      users: { select: { email: true } },
    },
  });

  console.log("\n=== BOLAG I DATABASEN ===");
  for (const c of companies) {
    console.log(`\nID: ${c.id}`);
    console.log(`Namn: ${c.name}`);
    console.log(`intakeEmail: ${c.intakeEmail}`);
    console.log(`Gmail: ${c.emailAccount?.email ?? "SAKNAS"}`);
    console.log(`Token går ut: ${c.emailAccount?.expiresAt ?? "—"}`);
    console.log(`Användare: ${c.users.map((u) => u.email).join(", ") || "inga"}`);
  }

  // Ta bort demo-company-001 om det existerar och saknar användare
  const demo = companies.find((c) => c.id === "demo-company-001");
  if (demo && demo.users.length === 0) {
    console.log("\nRaderar demo-company-001 (inga användare)...");
    await prisma.emailAccount.deleteMany({ where: { companyId: "demo-company-001" } });
    await prisma.categoryField.deleteMany({ where: { category: { companyId: "demo-company-001" } } });
    await prisma.issueCategory.deleteMany({ where: { companyId: "demo-company-001" } });
    await prisma.property.deleteMany({ where: { companyId: "demo-company-001" } });
    await prisma.company.delete({ where: { id: "demo-company-001" } });
    console.log("demo-company-001 raderat.");
  } else if (demo) {
    console.log(`\ndemo-company-001 har användare (${demo.users.map(u => u.email).join(", ")}) — raderas inte.`);
  } else {
    console.log("\ndemo-company-001 finns inte — inget att radera.");
  }

  const remaining = await prisma.company.findMany({ select: { id: true, name: true } });
  console.log(`\nKvarvarande bolag: ${remaining.map(c => `${c.name} (${c.id})`).join(", ")}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
