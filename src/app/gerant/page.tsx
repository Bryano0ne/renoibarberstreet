import type { Metadata } from "next";
import DashboardGerant from "@/components/gerant/DashboardGerant";

export const metadata: Metadata = {
  title: "Dashboard Gérant | Renoï Barberstreet",
  robots: { index: false, follow: false },
};

export default function GerantPage() {
  return (
    <main className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <DashboardGerant />
      </div>
    </main>
  );
}
