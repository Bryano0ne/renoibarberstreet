import type { Metadata } from "next";
import RecuClient from "@/components/paiement/RecuClient";

export const metadata: Metadata = {
  title: "Reçu de paiement | Renoï Barberstreet",
};

export default async function RecuPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  return (
    <RecuClient
      id={id}
      montant={Number(sp.montant || 0)}
      prestation={sp.prestation || ""}
      salon={sp.salon || ""}
      mode={sp.mode || "en_ligne"}
      date={sp.date || new Date().toISOString().split("T")[0]}
      heure={sp.heure || ""}
      barbier={sp.barbier || ""}
    />
  );
}
