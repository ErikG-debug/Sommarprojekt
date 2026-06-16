import Link from "next/link";
import { ThermalStripe } from "@/components/ui/ThermalStripe";
import type { CaseStatus } from "@prisma/client";

type TagKind = "bo" | "manual" | "closed" | null;

const TAG_CONFIG: Record<Exclude<TagKind, null>, { label: string; cls: string }> = {
  bo:     { label: "Bo jobbar",     cls: "bg-[#1a6ba8]/10 text-[#1a6ba8]" },
  manual: { label: "Manuellt fall", cls: "bg-amber-100 text-amber-800" },
  closed: { label: "Avslutat",      cls: "bg-gray-100 text-gray-600" },
};

function getTag(status: CaseStatus): TagKind {
  if (status === "COLLECTING_INFORMATION" || status === "WAITING_FOR_RESIDENT") return "bo";
  if (status === "ESCALATED") return "manual";
  if (status === "CLOSED" || status === "ARCHIVED") return "closed";
  return null;
}

function Tag({ kind }: { kind: TagKind }) {
  if (!kind) return null;
  const { label, cls } = TAG_CONFIG[kind];
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

interface CaseRowProps {
  id: string;
  subject: string;
  residentEmail: string;
  residentName: string | null;
  status: CaseStatus;
  category: { name: string } | null;
  property: { name: string } | null;
  updatedAt: string;
  lastMessage?: string;
}

export function CaseRow({
  id,
  subject,
  residentEmail,
  residentName,
  status,
  category,
  property,
  updatedAt,
  lastMessage,
}: CaseRowProps) {
  const timeAgo = formatTimeAgo(new Date(updatedAt));
  const tag = getTag(status);

  return (
    <Link href={`/dashboard/cases/${id}`} className="block">
      <div className="group relative flex items-center gap-4 px-5 py-4 transition hover:bg-[#1a6ba8]/5">
        <ThermalStripe className="pointer-events-none absolute inset-y-0 left-0 h-full w-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-gray-900">{subject}</p>
          <p className="mt-0.5 truncate text-sm text-gray-500">
            {residentName ?? residentEmail}
            {residentName && (
              <span className="ml-1 text-gray-400">· {residentEmail}</span>
            )}
            {lastMessage && (
              <span className="ml-2 text-gray-400">— {lastMessage}</span>
            )}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {property && (
            <span className="hidden text-xs text-gray-400 sm:block">{property.name}</span>
          )}
          {category && (
            <span className="hidden rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 sm:block">
              {category.name}
            </span>
          )}
          <Tag kind={tag} />
          <span className="w-16 text-right text-xs text-gray-400">{timeAgo}</span>
        </div>
      </div>
    </Link>
  );
}

function formatTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m sedan`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h sedan`;
  const days = Math.floor(hours / 24);
  return `${days}d sedan`;
}
