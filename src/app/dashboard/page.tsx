import { Suspense } from "react";
import { DashboardContent } from "./DashboardContent";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400">Laddar…</div>}>
      <DashboardContent />
    </Suspense>
  );
}
