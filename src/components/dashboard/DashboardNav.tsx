"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavActiveIndicator } from "@/components/ui/NavActiveIndicator";
import { SignOutButton } from "@/components/dashboard/SignOutButton";

function NavLink({ href, label, exact = false }: { href: string; label: string; exact?: boolean }) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`relative px-2 py-1 text-sm transition ${
        isActive ? "font-bold text-white" : "font-medium text-white/80 hover:text-white"
      }`}
    >
      {label}
      {isActive && (
        <NavActiveIndicator className="pointer-events-none absolute inset-x-0 -bottom-2 h-1.5 w-full" />
      )}
    </Link>
  );
}

export function DashboardNav() {
  return (
    <nav className="flex items-center justify-center gap-8 drop-shadow">
      <NavLink href="/dashboard" label="Ärenden" exact />
      <NavLink href="/dashboard/settings" label="Inställningar" />
      <SignOutButton />
    </nav>
  );
}
