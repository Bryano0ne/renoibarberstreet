"use client";
import { useState } from "react";
import type { Metadata } from "next";
import { formatFCFA } from "@/lib/utils";

const MONTANTS = [5000, 10000, 15000, 20000];

export default function CartesGadeauxPage() {
  const [montant, setMontant] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [carte, setCarte] = useState<{ code: string; montant: number } | null>(null);
  const [error, setError] = useState("");

  const acheter = async () => {
    if (!montant) return;
    setLoading(true); setError(""); setCarte(null);
    const res = await fetch("/api/cartes-cadeaux", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ montant }),
    });
    const data = await res.json();
    if (!res.ok) setError(data.error);
    else setCarte(data.carte);
    setLoading(false);
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">Offrez une expérience</p>
          <h1 className="text-3xl font-black text-[#F5F0E8] mb-2">Carte cadeau 💈</h1>
          <p className="text-[#F5F0E8]/40 text-sm">Offrez une coupe à vos proches · Valable dans les 2 salons</p>
        </div>

        {carte ? (
          // Résultat
          <div className="relative overflow-hidden rounded-2xl border border-[#C9A84C]/40 bg-gradient-to-br from-[#1A1000] to-[#0A0A0A] p-8 text-center">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, #C9A84C 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
            <div className="relative z-10">
              <p className="text-[#C9A84C]/60 text-xs tracking-widest uppercase mb-2">Carte cadeau générée</p>
              <p className="text-[#F5F0E8] font-black text-4xl tracking-widest font-mono mb-2">{carte.code}</p>
              <p className="text-[#C9A84C] font-black text-2xl mb-6">{formatFCFA(carte.montant)}</p>
              <p className="text-[#F5F0E8]/30 text-xs mb-6 leading-relaxed">
                Communiquez ce code à l&apos;heureux bénéficiaire.<br />
                Il pourra l&apos;utiliser lors de sa prochaine réservation.
              </p>
              <button
                onClick={() => navigator.clipboard.writeText(carte.code)}
                className="w-full border border-[#C9A84C]/40 text-[#C9A84C] py-3 rounded-xl text-sm font-semibold hover:bg-[#C9A84C]/10 transition-all mb-3"
              >
                📋 Copier le code
              </button>
              <button
                onClick={() => { setCarte(null); setMontant(null); }}
                className="text-[#F5F0E8]/25 text-sm hover:text-[#F5F0E8]/50 transition-colors"
              >
                Acheter une autre carte
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Choix montant */}
            <p className="text-xs text-[#F5F0E8]/40 uppercase tracking-widest mb-4">Choisissez le montant</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {MONTANTS.map(m => (
                <button
                  key={m}
                  onClick={() => setMontant(m)}
                  className={`py-6 rounded-xl border-2 font-black text-lg transition-all ${
                    montant === m
                      ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]"
                      : "border-[#2A2A2A] bg-[#111111] text-[#F5F0E8]/60 hover:border-[#C9A84C]/40"
                  }`}
                >
                  {formatFCFA(m)}
                </button>
              ))}
            </div>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            <button
              onClick={acheter}
              disabled={!montant || loading}
              className="w-full bg-[#C9A84C] text-[#0A0A0A] font-black py-4 rounded-xl disabled:opacity-30 hover:bg-[#E2C47A] transition-all flex items-center justify-center gap-2"
            >
              {loading ? <><div className="w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" /> Génération...</> : "🎁 Générer la carte cadeau"}
            </button>

            <p className="text-center text-xs text-[#F5F0E8]/20 mt-4">
              La carte est valable 1 an · Non remboursable
            </p>
          </>
        )}
      </div>
    </main>
  );
}
