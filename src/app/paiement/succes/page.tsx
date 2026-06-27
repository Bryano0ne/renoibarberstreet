"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatFCFA } from "@/lib/utils";

function SuccesContent() {
  const params = useSearchParams();
  const id       = params.get("id") || "";
  const montant  = Number(params.get("montant") || 0);
  const mode     = params.get("mode") || "en_ligne";
  const prestation = params.get("prestation") || "";
  const salon    = params.get("salon") || "";
  const demo     = params.get("demo") === "1";
  const txn      = params.get("txn") || "";

  const surPlace = mode === "sur_place";

  return (
    <div className="max-w-md mx-auto text-center">
      {/* Icône succès */}
      <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6">
        <span className="text-5xl">{surPlace ? "🏠" : "✅"}</span>
      </div>

      <h1 className="text-2xl font-black text-[#F5F0E8] mb-2">
        {surPlace ? "Réservation confirmée !" : "Paiement confirmé !"}
      </h1>
      <p className="text-[#F5F0E8]/40 text-sm mb-8">
        {surPlace
          ? "Votre créneau est réservé. Payez sur place le jour J."
          : demo
            ? "Simulation de paiement réussie. En production, le paiement sera traité par CinetPay."
            : "Votre paiement a bien été reçu. Un reçu vous sera envoyé sur WhatsApp."}
      </p>

      {/* Détails */}
      <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5 text-left mb-6 space-y-3">
        <div className="flex justify-between">
          <span className="text-[#F5F0E8]/40 text-sm">Référence</span>
          <span className="text-[#C9A84C] font-black font-mono text-sm">{id}</span>
        </div>
        {prestation && (
          <div className="flex justify-between">
            <span className="text-[#F5F0E8]/40 text-sm">Prestation</span>
            <span className="text-[#F5F0E8] font-semibold text-sm">{prestation}</span>
          </div>
        )}
        {salon && (
          <div className="flex justify-between">
            <span className="text-[#F5F0E8]/40 text-sm">Salon</span>
            <span className="text-[#F5F0E8] text-sm">Renoï {salon}</span>
          </div>
        )}
        {montant > 0 && (
          <div className="flex justify-between">
            <span className="text-[#F5F0E8]/40 text-sm">Montant</span>
            <span className={`font-black text-sm ${surPlace ? "text-[#F5F0E8]/60" : "text-green-400"}`}>
              {surPlace ? `${formatFCFA(montant)} (sur place)` : formatFCFA(montant)}
            </span>
          </div>
        )}
        {txn && !demo && (
          <div className="flex justify-between">
            <span className="text-[#F5F0E8]/40 text-sm">Transaction</span>
            <span className="text-[#F5F0E8]/40 text-xs font-mono">{txn}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-[#F5F0E8]/40 text-sm">Statut</span>
          <span className="text-green-400 font-semibold text-sm">
            {surPlace ? "Réservé — paiement sur place" : "Payé ✓"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Link
          href={`/paiement/recu/${id}?montant=${montant}&prestation=${encodeURIComponent(prestation)}&salon=${salon}&mode=${mode}`}
          className="flex items-center justify-center gap-2 w-full border border-[#C9A84C]/40 text-[#C9A84C] font-semibold py-3 rounded-xl hover:bg-[#C9A84C]/5 transition-all text-sm"
        >
          🖨️ Voir / Imprimer le reçu
        </Link>
        <Link href="/reserver" className="flex items-center justify-center w-full bg-[#C9A84C] text-[#0A0A0A] font-black py-3 rounded-xl hover:bg-[#E2C47A] transition-all text-sm">
          ✂️ Nouvelle réservation
        </Link>
        <Link href="/" className="flex items-center justify-center w-full text-[#F5F0E8]/25 text-sm py-2 hover:text-[#F5F0E8]/50 transition-colors">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}

export default function PaiementSuccesPage() {
  return (
    <main className="min-h-screen flex items-center justify-center pt-16 pb-16 px-4">
      <Suspense fallback={<div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />}>
        <SuccesContent />
      </Suspense>
    </main>
  );
}
