import type { Metadata } from "next";
import Link from "next/link";
import { SALONS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Nos Salons — RENOI Barberstreet | ZAD & SAABA Ouagadougou",
  description:
    "RENOI Barberstreet dispose de 2 salons à Ouagadougou : ZAD (en face Black Diamond) et SAABA (Route USTA). Ouverts 7j/7 de 9h à 21h.",
};

export default function NosSalonsPage() {
  return (
    <main className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">Où nous trouver</p>
          <h1 className="text-5xl font-black text-[#F5F0E8] mb-4">
            Nos <span className="text-[#C9A84C]">Salons</span>
          </h1>
          <p className="text-[#F5F0E8]/50 max-w-xl mx-auto">
            Deux adresses au cœur d&apos;Ouagadougou pour te servir au mieux.
            Ouvert chaque jour de 9h à 21h — sans exception.
          </p>
        </div>

        {/* Salons */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {Object.values(SALONS).map((salon) => (
            <div
              key={salon.id}
              className="bg-[#111111] border border-[#2A2A2A] rounded-2xl overflow-hidden hover:border-[#C9A84C]/40 transition-all group"
            >
              {/* Map placeholder */}
              <div className="h-48 bg-gradient-to-br from-[#1A1A1A] to-[#0d0d0d] border-b border-[#2A2A2A] flex items-center justify-center relative">
                <span className="text-6xl opacity-20">🗺️</span>
                <a
                  href={salon.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-end justify-end p-4"
                >
                  <span className="bg-[#C9A84C] text-[#0A0A0A] text-xs font-bold px-3 py-1.5 rounded-full hover:bg-[#E2C47A] transition-colors">
                    Ouvrir Maps →
                  </span>
                </a>
              </div>

              <div className="p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-[#C9A84C]/10 rounded-xl flex items-center justify-center">
                    <span className="text-lg">📍</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#C9A84C]">{salon.nom}</h2>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-xs text-[#F5F0E8]/30 uppercase tracking-widest mb-1">Adresse</p>
                    <p className="text-[#F5F0E8]/70 text-sm leading-relaxed">{salon.adresse}</p>
                    <p className="text-[#F5F0E8]/50 text-sm">{salon.quartier}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#F5F0E8]/30 uppercase tracking-widest mb-1">Horaires</p>
                    <p className="text-[#F5F0E8]/70 text-sm">{salon.horaires}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#F5F0E8]/30 uppercase tracking-widest mb-1">Contact</p>
                    <a
                      href={`tel:${salon.telephone}`}
                      className="text-[#C9A84C] font-semibold text-sm hover:underline"
                    >
                      {salon.telephone}
                    </a>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    href="/reserver"
                    className="bg-[#C9A84C] text-[#0A0A0A] font-bold text-sm px-6 py-3 rounded-full text-center hover:bg-[#E2C47A] transition-colors"
                  >
                    Réserver à {salon.nom.split(" ")[1]}
                  </Link>
                  <a
                    href={`https://wa.me/${salon.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-green-500/30 text-green-400 font-semibold text-sm px-6 py-3 rounded-full text-center hover:bg-green-500/10 transition-colors"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Horaires détaillés */}
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-8 text-center mb-12">
          <h3 className="text-xl font-black text-[#F5F0E8] mb-6">Horaires d&apos;ouverture</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map((jour) => (
              <div key={jour} className="bg-[#1A1A1A] rounded-xl p-3">
                <p className="text-xs text-[#F5F0E8]/40 uppercase tracking-widest mb-1">{jour}</p>
                <p className="text-[#C9A84C] font-bold text-sm">9h00 – 21h00</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
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
