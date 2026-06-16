import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CaseRow } from "@/components/cases/CaseRow";
import type { CaseStatus } from "@prisma/client";

type FilterKey = "bo_hanterar" | "redo" | "bokat" | "manuella" | "avslutade" | "alla";

const FILTER_TABS: { label: string; value: FilterKey; statuses: CaseStatus[] }[] = [
  { label: "Bo hanterar",          value: "bo_hanterar", statuses: ["COLLECTING_INFORMATION", "WAITING_FOR_RESIDENT"] },
  { label: "Redo för godkännande", value: "redo",         statuses: ["READY_FOR_REVIEW"] },
  { label: "Bokat",                value: "bokat",        statuses: ["IN_PROGRESS"] },
  { label: "Manuella fall",        value: "manuella",     statuses: ["ESCALATED"] },
  { label: "Avslutade",            value: "avslutade",    statuses: ["CLOSED", "ARCHIVED"] },
  { label: "Alla",                 value: "alla",         statuses: [] },
];

interface PageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session) redirect("/login");

  const { companyId } = session.user;
  const { filter } = await searchParams;
  const activeFilter = (filter as FilterKey) ?? "alla";

  const activeTab =
    FILTER_TABS.find((t) => t.value === activeFilter) ??
    FILTER_TABS.find((t) => t.value === "alla")!;

  const statusFilter =
    activeTab.statuses.length > 0 ? { status: { in: activeTab.statuses } } : {};

  const [cases, statusCounts] = await Promise.all([
    prisma.case.findMany({
      where: { companyId, ...statusFilter },
      orderBy: [{ updatedAt: "desc" }],
      include: {
        category: { select: { name: true } },
        property: { select: { name: true } },
        messages: { orderBy: { sentAt: "desc" }, take: 1 },
      },
    }),
    prisma.case.groupBy({
      by: ["status"],
      _count: { status: true },
      where: { companyId },
    }),
  ]);

  const statusCountMap = Object.fromEntries(
    statusCounts.map((c) => [c.status, c._count.status])
  );

  function tabCount(tab: (typeof FILTER_TABS)[0]) {
    if (tab.statuses.length === 0)
      return statusCounts.reduce((sum, c) => sum + c._count.status, 0);
    return tab.statuses.reduce((sum, s) => sum + (statusCountMap[s] ?? 0), 0);
  }

  return (
    <div>
      <div className="mb-6 flex gap-0 overflow-x-auto border-b border-gray-200">
        {FILTER_TABS.map((tab) => {
          const count = tabCount(tab);
          const isActive = activeFilter === tab.value;
          return (
            <a
              key={tab.value}
              href={
                tab.value === "alla"
                  ? "/dashboard"
                  : `/dashboard?filter=${tab.value}`
              }
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "border-[#1a6ba8] text-[#1a6ba8]"
                  : "border-transparent text-gray-500 hover:text-[#1a6ba8]"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs ${
                    isActive
                      ? "bg-[#1a6ba8]/10 text-[#1a6ba8]"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {count}
                </span>
              )}
            </a>
          );
        })}
      </div>

      {cases.length === 0 ? (
        <div className="py-20 text-center text-gray-500">Inga ärenden att visa</div>
      ) : (
        <div className="divide-y divide-blue-50 overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm shadow-blue-100">
          {cases.map((c) => (
            <CaseRow
              key={c.id}
              id={c.id}
              subject={c.subject}
              residentEmail={c.residentEmail}
              residentName={c.residentName}
              status={c.status}
              category={c.category}
              property={c.property}
              updatedAt={c.updatedAt.toISOString()}
              lastMessage={c.messages[0]?.body.slice(0, 100)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
