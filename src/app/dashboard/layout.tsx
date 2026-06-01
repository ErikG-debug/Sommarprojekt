import Link from "next/link";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 40%, #f0f9ff 100%)",
        backgroundImage:
          "radial-gradient(circle, #93c5fd30 1px, transparent 1px), linear-gradient(135deg, #eff6ff 0%, #f8fafc 40%, #f0f9ff 100%)",
        backgroundSize: "28px 28px, 100% 100%",
      }}
    >
      <header className="sticky top-0 z-10 border-b border-blue-100 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/dashboard">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-lg font-bold text-transparent">
              PropDesk
            </span>
          </Link>
          <nav className="flex gap-6 text-sm text-gray-500">
            <Link href="/dashboard" className="transition hover:text-blue-600">
              Ärenden
            </Link>
            <Link href="/dashboard/settings" className="transition hover:text-blue-600">
              Inställningar
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
