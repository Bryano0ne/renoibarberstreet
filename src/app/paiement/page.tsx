"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { formatFCFA } from "@/lib/utils";

const METHODES = [
  { id: "orange_money", label: "Orange Money", icon: "🟠", color: "border-orange-500/40 hover:border-orange-500" },
  { id: "moov_money",   label: "Moov Money",   icon: "🔵", color: "border-blue-500/40 hover:border-blue-500" },
  { id: "wave",         label: "Wave",         icon: "🌊", color: "border-cyan-500/40 hover:border-cyan-500" },
  { id: "sur_place",    label: "Payer sur place", icon: "🏠", color: "border-[#C9A84C]/40 hover:border-[#C9A84C]" },
];

function PaiementForm() {
  const params = useSearchParams();
  const router = useRouter();

  const id       = params.get("id") || "";
  const montant  = Number(params.get("montant") || 0);
  const prestation = params.get("prestation") || "";
  const salon    = params.get("salon") || "";
  const nom      = params.get("nom") || "";
  const tel      = params.get("tel") || "";
  const date     = params.get("date") || "";
  const heure    = params.get("heure") || "";

  const [methode, setMethode] = useState("");
  const [codeCarteCadeau, setCodeCarte] = useState("");
  const [carteInfo, setCarteInfo] = useState<{ montant: number } | null>(null);
  const [carteError, setCarteError] = useState("");
  const [carteLoading, setCarteLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const reduction = carteInfo?.montant ?? 0;
  const total = Math.max(0, montant - reduction);

  const verifierCarte = async () => {
    if (!codeCarteCadeau.trim()) return;
    setCarteLoading(true); setCarteError(""); setCarteInfo(null);
    const res = await fetch(`/api/cartes-cadeaux?code=${codeCarteCadeau.trim()}`);
    const data = await res.json();
    if (!res.ok) { setCarteError(data.error); }
    else { setCarteInfo(data); }
    setCarteLoading(false);
  };

  const handlePayer = async () => {
    if (!methode) { setError("Choisissez une méthode de paiement."); return; }
    if (methode === "sur_place") {
      router.push(`/paiement/succes?id=${id}&montant=${montant}&mode=sur_place&prestation=${encodeURIComponent(prestation)}&salon=${salon}`);
      return;
    }
    setPaying(true); setError("");
    try {
      const res = await fetch("/api/paiement/initier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservation_id: id, montant: total,
          client_nom: nom, client_telephone: tel,
          description: `${prestation} — RENOI ${salon}`,
          methode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.payment_url;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur paiement");
      setPaying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Récap réservation */}
      <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5 mb-6">
        <p className="text-[10px] text-[#C9A84C] uppercase tracking-widest mb-3">Récapitulatif</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-[#F5F0E8]/40">Réservation</span><span className="text-[#F5F0E8] font-mono text-xs">{id}</span></div>
          <div className="flex justify-between"><span className="text-[#F5F0E8]/40">Prestation</span><span className="text-[#F5F0E8] font-semibold">{prestation}</span></div>
          <div className="flex justify-between"><span className="text-[#F5F0E8]/40">Salon</span><span className="text-[#F5F0E8]">RENOI {salon}</span></div>
          {date && <div className="flex justify-between"><span className="text-[#F5F0E8]/40">Date</span><span className="text-[#F5F0E8]">{date} · {heure}</span></div>}
          <div className="h-px bg-[#2A2A2A] my-2" />
          {reduction > 0 && <>
            <div className="flex justify-between"><span className="text-[#F5F0E8]/40">Sous-total</span><span className="text-[#F5F0E8]">{formatFCFA(montant)}</span></div>
            <div className="flex justify-between"><span className="text-green-400/80">Carte cadeau</span><span className="text-green-400">- {formatFCFA(reduction)}</span></div>
          </>}
          <div className="flex justify-between items-center">
            <span className="text-[#F5F0E8] font-black">Total</span>
            <span className="text-[#C9A84C] font-black text-xl">{formatFCFA(total)}</span>
          </div>
        </div>
      </div>

      {/* Carte cadeau */}
      <div className="mb-5">
        <p className="text-xs text-[#F5F0E8]/40 uppercase tracking-widest mb-2">Code cadeau (optionnel)</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={codeCarteCadeau}
            onChange={e => { setCodeCarte(e.target.value.toUpperCase()); setCarteInfo(null); setCarteError(""); }}
            placeholder="RENOI-XXXX-XXXX"
            className="flex-1 bg-[#111111] border border-[#2A2A2A] text-[#F5F0E8] rounded-xl px-4 py-2.5 text-sm focus:border-[#C9A84C] focus:outline-none font-mono placeholder:text-[#F5F0E8]/20 placeholder:font-sans"
          />
          <button onClick={verifierCarte} disabled={carteLoading} className="px-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F0E8]/60 rounded-xl text-sm hover:border-[#C9A84C]/40 hover:text-[#C9A84C] transition-all disabled:opacity-40">
            {carteLoading ? "..." : "Vérifier"}
          </button>
        </div>
        {carteError && <p className="text-red-400 text-xs mt-1">{carteError}</p>}
        {carteInfo && <p className="text-green-400 text-xs mt-1">✓ Carte valide — {formatFCFA(carteInfo.montant)} de réduction appliquée</p>}
      </div>

      {/* Méthode paiement */}
      <p className="text-xs text-[#F5F0E8]/40 uppercase tracking-widest mb-3">Méthode de paiement</p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {METHODES.map(m => (
          <button
            key={m.id}
            onClick={() => setMethode(m.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              methode === m.id
                ? "border-[#C9A84C] bg-[#C9A84C]/10"
                : `bg-[#111111] ${m.color}`
            }`}
          >
            <span className="text-2xl">{m.icon}</span>
            <span className={`text-xs font-semibold ${methode === m.id ? "text-[#C9A84C]" : "text-[#F5F0E8]/60"}`}>{m.label}</span>
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2 mb-4">{error}</p>}

      <button
        onClick={handlePayer}
        disabled={!methode || paying}
        className="w-full bg-[#C9A84C] text-[#0A0A0A] font-black py-4 rounded-xl disabled:opacity-30 hover:bg-[#E2C47A] transition-all text-base flex items-center justify-center gap-2"
      >
        {paying ? (
          <><div className="w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" /> Redirection...</>
        ) : methode === "sur_place" ? "Confirmer — Paiement sur place" : `Payer ${formatFCFA(total)}`}
      </button>

      <p className="text-center text-[10px] text-[#F5F0E8]/15 mt-3">Paiement sécurisé par CinetPay · XOF</p>
    </div>
  );
}

export default function PaiementPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-md mx-auto text-center mb-10">
        <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">Paiement sécurisé</p>
        <h1 className="text-3xl font-black text-[#F5F0E8] mb-2">Finaliser votre réservation</h1>
        <p className="text-[#F5F0E8]/40 text-sm">Orange Money · Moov Money · Wave · Sur place</p>
      </div>
      <Suspense fallback={<div className="flex justify-center"><div className="w-6 h-6 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" /></div>}>
        <PaiementForm />
      </Suspense>
    </main>
  );
}
