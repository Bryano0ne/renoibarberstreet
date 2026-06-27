import type { Metadata } from "next";
import { getBarbierSession } from "@/app/actions/barbier";
import BarbierDashboard from "@/components/barbier/BarbierDashboard";

export const metadata: Metadata = {
  title: "Espace Barbier | RENOI Barberstreet",
  robots: { index: false, follow: false },
};

export default async function BarbierPage() {
  const session = await getBarbierSession();
  return (
    <main className="min-h-screen pt-20 pb-16 px-4">
      <BarbierDashboard
        barbierPrenom={session!.prenom}
        salonNom={session!.salon_nom}
      />
    </main>
  );
}
