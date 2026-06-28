import type { Metadata } from "next";
import Link from "next/link";
import { AVIS_DEMO } from "@/lib/demo-data";
import FormulaireAvis from "@/components/avis/FormulaireAvis";

export const metadata: Metadata = {
  title: "Avis Clients — RENOI Barberstreet | Barbershop Ouagadougou",
  description:
    "Lisez les avis de nos clients sur RENOI Barberstreet. Note moyenne 4.9/5. Barbershop premium à Ouagadougou, ZAD & SAABA.",
};

export default function AvisPage() {
  const noteMoyenne = (
    AVIS_DEMO.reduce((acc, a) => acc + a.note, 0) / AVIS_DEMO.length
  ).toFixed(1);

  const repartition = [5, 4, 3, 2, 1].map((note) => ({
    note,
    count: AVIS_DEMO.filter((a) => a.note === note).length,
    pct: Math.round((AVIS_DEMO.filter((a) => a.note === note).length / AVIS_DEMO.length) * 100),
  }));

  return (
    <main className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">Témoignages</p>
          <h1 className="text-5xl font-black text-[#F5F0E8] mb-4">
            Avis <span className="text-[#C9A84C]">Clients</span>
          </h1>
          <p className="text-[#F5F0E8]/50 max-w-xl mx-auto">
            La satisfaction de nos clients est notre meilleure récompense.
            Découvrez ce qu&apos;ils pensent de leur expérience chez RENOI.
          </p>
        </div>

        {/* Stats globales */}
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center">
              <div className="text-8xl font-black text-[#C9A84C] leading-none">{noteMoyenne}</div>
              <div className="text-2xl my-2">⭐⭐⭐⭐⭐</div>
              <p className="text-[#F5F0E8]/40 text-sm">{AVIS_DEMO.length} avis · ZAD & SAABA</p>
            </div>

            <div className="space-y-3">
              {repartition.map(({ note, count, pct }) => (
                <div key={note} className="flex items-center gap-3">
                  <span className="text-sm text-[#F5F0E8]/50 w-4">{note}</span>
                  <span className="text-xs">⭐</span>
                  <div className="flex-1 bg-[#1A1A1A] rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-[#C9A84C] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#F5F0E8]/30 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filtres salons */}
        <div className="flex gap-3 mb-8">
          {["Tous", "ZAD", "SAABA"].map((f) => (
            <button
              key={f}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                f === "Tous"
                  ? "bg-[#C9A84C] text-[#0A0A0A]"
                  : "border border-[#2A2A2A] text-[#F5F0E8]/50 hover:border-[#C9A84C]/40 hover:text-[#C9A84C]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grille avis */}
        <div className="grid md:grid-cols-2 gap-5 mb-12">
          {AVIS_DEMO.map((avis) => (
            <div
              key={avis.id}
              className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#C9A84C]/30 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-0.5">
                  {Array(avis.note).fill("⭐").map((s, i) => (
                    <span key={i} className="text-sm">{s}</span>
                  ))}
                </div>
                <span className="text-xs text-[#C9A84C] bg-[#C9A84C]/10 border border-[#C9A84C]/20 px-2 py-0.5 rounded-full">
                  {avis.salon}
                </span>
              </div>
              <p className="text-[#F5F0E8]/70 text-sm leading-relaxed mb-5 italic">
                &ldquo;{avis.commentaire}&rdquo;
              </p>
              <div className="flex items-center justify-between border-t border-[#2A2A2A] pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#C9A84C]/15 flex items-center justify-center text-xs font-bold text-[#C9A84C]">
                    {avis.prenom[0]}
                  </div>
                  <span className="font-semibold text-[#F5F0E8] text-sm">{avis.prenom}</span>
                </div>
                <span className="text-xs text-[#F5F0E8]/25">{avis.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Formulaire avis — accessible sans compte */}
        <FormulaireAvis />

        <div className="text-center mt-12">
          <Link
            href="/reserver"
            className="inline-block bg-[#C9A84C] text-[#0A0A0A] font-black px-10 py-4 rounded-full text-lg hover:bg-[#E2C47A] transition-all hover:scale-105"
          >
            Réserver maintenant 💈
          </Link>
        </div>
      </div>
    </main>
  );
}
