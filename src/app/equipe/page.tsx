import type { Metadata } from "next";
import Link from "next/link";
import { BARBIERS_DEMO } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Notre Équipe — Renoï // City Barber | Barbiers Ouagadougou",
  description:
    "Découvrez l'équipe de barbiers de Renoï // City Barber : des artistes passionnés à ZAD et SAABA, Ouagadougou.",
};

export default function EquipePage() {
  const zadBarbiers = BARBIERS_DEMO.filter((b) => b.salon_id === "zad");
  const saabaBarbiers = BARBIERS_DEMO.filter((b) => b.salon_id === "saaba");

  return (
    <main className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">Nos artistes</p>
          <h1 className="text-5xl font-black text-[#F5F0E8] mb-4">
            Notre <span className="text-[#C9A84C]">Équipe</span>
          </h1>
          <p className="text-[#F5F0E8]/50 max-w-xl mx-auto">
            Des barbiers passionnés, formés aux techniques les plus modernes.
            Chaque coupe est une œuvre — la valeur sûre, à chaque fois.
          </p>
        </div>

        {/* Salon ZAD */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-7">
            <div className="h-px flex-1 bg-[#2A2A2A]" />
            <span className="text-[#C9A84C] font-bold text-sm tracking-widest uppercase px-4">
              📍 Salon ZAD
            </span>
            <div className="h-px flex-1 bg-[#2A2A2A]" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {zadBarbiers.map((b) => (
              <BarbierCard key={b.id} barbier={b} />
            ))}
          </div>
        </div>

        {/* Salon SAABA */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-7">
            <div className="h-px flex-1 bg-[#2A2A2A]" />
            <span className="text-[#C9A84C] font-bold text-sm tracking-widest uppercase px-4">
              📍 Salon SAABA
            </span>
            <div className="h-px flex-1 bg-[#2A2A2A]" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {saabaBarbiers.map((b) => (
              <BarbierCard key={b.id} barbier={b} />
            ))}
          </div>
        </div>

        {/* Rejoins l'équipe */}
        <div className="bg-gradient-to-br from-[#111111] to-[#0d0800] border border-[#C9A84C]/20 rounded-2xl p-8 text-center">
          <p className="text-3xl mb-4">💈</p>
          <h3 className="text-2xl font-black text-[#F5F0E8] mb-3">
            Tu es barbier ?
          </h3>
          <p className="text-[#F5F0E8]/50 mb-6 max-w-sm mx-auto text-sm">
            Renoï // City Barber recherche toujours des artistes talentueux pour rejoindre l&apos;équipe.
          </p>
          <a
            href="https://wa.me/+22667912222?text=Bonjour%2C%20je%20suis%20int%C3%A9ress%C3%A9(e)%20pour%20rejoindre%20l%27%C3%A9quipe%20Reno%C3%AF%20City%20Barber."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white font-bold px-7 py-3 rounded-full hover:bg-green-600 transition-colors"
          >
            💬 Nous contacter sur WhatsApp
          </a>
        </div>

        {/* CTA */}
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

function BarbierCard({ barbier }: { barbier: (typeof BARBIERS_DEMO)[0] }) {
  return (
    <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5 text-center hover:border-[#C9A84C]/40 transition-all group">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C9A84C]/15 to-[#8B2500]/15 border-2 border-[#2A2A2A] mx-auto mb-4 flex items-center justify-center group-hover:border-[#C9A84C]/40 transition-all">
        <span className="text-4xl">💈</span>
      </div>
      <h3 className="font-black text-[#F5F0E8] text-lg mb-1">{barbier.prenom}</h3>
      <span className="inline-block text-xs text-[#C9A84C] bg-[#C9A84C]/10 border border-[#C9A84C]/20 px-3 py-0.5 rounded-full mb-3">
        {barbier.salon_nom}
      </span>
      <div className="flex flex-wrap gap-1 justify-center">
        {barbier.specialites.map((s) => (
          <span
            key={s}
            className="text-xs text-[#F5F0E8]/40 bg-[#1A1A1A] px-2 py-0.5 rounded-full"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
