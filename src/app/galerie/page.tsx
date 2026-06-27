import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Galerie — Renoï // City Barber | Coupes & Réalisations Ouagadougou",
  description:
    "Découvrez les réalisations de Renoï // City Barber : dégradés, coupes afro, barbes sculptées. Barbershop premium à Ouagadougou.",
};

const CATEGORIES = ["Tous", "Dégradé", "Afro", "Barbe", "Combo", "Soins"];

const GALLERY_ITEMS = Array(12).fill(null).map((_, i) => ({
  id: i + 1,
  label: ["Dégradé", "Afro sculpté", "Barbe", "Combo", "Dégradé", "Afro sculpting", "Rasage", "Coupe classique", "Dégradé", "Barbe sculptée", "Combo", "Afro"][i],
  salon: i % 2 === 0 ? "ZAD" : "SAABA",
  icon: ["💈", "✂️", "🪒", "💈", "✂️", "🪒", "💈", "✂️", "🪒", "💈", "✂️", "🪒"][i],
}));

export default function GaleriePage() {
  return (
    <main className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">Nos réalisations</p>
          <h1 className="text-5xl font-black text-[#F5F0E8] mb-4">
            La <span className="text-[#C9A84C]">Galerie</span>
          </h1>
          <p className="text-[#F5F0E8]/50 max-w-xl mx-auto">
            Chaque coupe est une signature. Découvrez le travail de nos barbiers
            à travers leurs meilleures réalisations.
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                cat === "Tous"
                  ? "bg-[#C9A84C] text-[#0A0A0A]"
                  : "border border-[#2A2A2A] text-[#F5F0E8]/50 hover:border-[#C9A84C]/40 hover:text-[#C9A84C]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grille photos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-12">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              className="aspect-square bg-gradient-to-br from-[#1A1A1A] to-[#0d0d0d] border border-[#2A2A2A] rounded-2xl flex flex-col items-center justify-center hover:border-[#C9A84C]/40 transition-all group cursor-pointer relative overflow-hidden"
            >
              <span className="text-5xl opacity-20 group-hover:opacity-50 group-hover:scale-125 transition-all duration-500">
                {item.icon}
              </span>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0A0A]/90 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-xs font-semibold text-[#F5F0E8]">{item.label}</p>
                <p className="text-xs text-[#C9A84C]">{item.salon}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram CTA */}
        <div className="bg-gradient-to-br from-[#111111] to-[#0d0800] border border-[#2A2A2A] rounded-2xl p-10 text-center">
          <p className="text-4xl mb-4">📸</p>
          <h3 className="text-2xl font-black text-[#F5F0E8] mb-3">
            Encore plus sur Instagram
          </h3>
          <p className="text-[#F5F0E8]/50 mb-7 text-sm">
            Suivez nos comptes pour voir toutes nos réalisations en temps réel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold px-7 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              @renoi_barberstreet
            </a>
            <a
              href={BRAND.instagramSaaba}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-[#2A2A2A] text-[#F5F0E8]/70 font-semibold px-7 py-3 rounded-full hover:border-[#C9A84C]/40 hover:text-[#C9A84C] transition-all"
            >
              @renoi_barberstreet_saaba
            </a>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/reserver"
            className="inline-block bg-[#C9A84C] text-[#0A0A0A] font-black px-10 py-4 rounded-full text-lg hover:bg-[#E2C47A] transition-all hover:scale-105"
          >
            Réserver ma coupe 💈
          </Link>
        </div>
      </div>
    </main>
  );
}
