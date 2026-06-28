import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PRESTATIONS_DEMO } from "@/lib/demo-data";
import { formatFCFA, formatDuration } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Prestations & Services — RENOI Barberstreet | Ouagadougou",
  description:
    "Découvrez toutes les prestations de RENOI Barberstreet : coupes homme, barbe, soins, boissons en salon et Haircut Replay. Barbershop ZAD & SAABA, Ouagadougou.",
};

const BADGE_STYLES: Record<string, string> = {
  populaire: "bg-[#8B2500]/80 text-[#F5F0E8] border border-[#8B2500]",
  nouveau: "bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/50",
  bestseller: "bg-[#C9A84C] text-[#0A0A0A]",
};
const BADGE_LABELS: Record<string, string> = {
  populaire: "🔥 Populaire",
  nouveau: "✨ Nouveau",
  bestseller: "💈 Best-seller",
};

const CATS = [
  { id: "coupe",  label: "Coupes homme", emoji: "✂️" },
  { id: "barbe",  label: "Barbe",        emoji: "🪒" },
  { id: "combo",  label: "Combos",       emoji: "💈" },
  { id: "enfant", label: "Enfant",       emoji: "👦" },
  { id: "soins",  label: "Soins",        emoji: "🌿" },
];

// Photos réelles pour certaines prestations
const PRESTATION_PHOTOS: Record<string, string> = {
  "1": "/images/prestations/coupe-classique.jpg",
  "2": "/images/prestations/degrade-classique.jpg",
  "3": "/images/prestations/afro-sculpte.jpg",
  "4": "/images/prestations/taille-barbe.jpg",
  "5": "/images/prestations/rasage-traditionnel.jpg",
  "6": "/images/prestations/combo-coupe-barbe.jpg",
  "7": "/images/prestations/enfant.jpg",
  "8": "/images/prestations/soin-chevelu.svg",
};

export default function PrestationsPage() {
  return (
    <main className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">
            Ce qu&apos;on fait
          </p>
          <h1 className="text-5xl font-black text-[#F5F0E8] mb-3">
            Nos <span className="text-[#C9A84C]">Prestations</span>
          </h1>
          <p className="text-[#F5F0E8]/40 text-sm max-w-md mx-auto">
            Coupes, barbe, soins, boissons et divertissement — tout pour que ton passage
            chez RENOI soit une expérience complète.
          </p>
        </div>

        {/* ── COUPES & BARBE ─────────────────────────────────────── */}
        {CATS.map((cat) => {
          const items = PRESTATIONS_DEMO.filter((p) => p.categorie === cat.id);
          if (items.length === 0) return null;
          return (
            <section key={cat.id} className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{cat.emoji}</span>
                <h2 className="text-2xl font-black text-[#F5F0E8]">{cat.label}</h2>
                <div className="flex-1 h-px bg-[#2A2A2A]" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {items.map((p) => (
                  <div
                    key={p.id}
                    className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5 flex items-start gap-4 hover:border-[#C9A84C]/30 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#2A2A2A] shrink-0 group-hover:border-[#C9A84C]/40 transition-all relative bg-[#1A1A1A]">
                      {PRESTATION_PHOTOS[p.id] ? (
                        <Image
                          src={PRESTATION_PHOTOS[p.id]}
                          alt={p.nom}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex items-center justify-center w-full h-full text-2xl">
                          {cat.emoji}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-black text-[#F5F0E8]">{p.nom}</h3>
                        {p.badge && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${BADGE_STYLES[p.badge]}`}>
                            {BADGE_LABELS[p.badge]}
                          </span>
                        )}
                      </div>
                      <p className="text-[#F5F0E8]/40 text-xs leading-relaxed mb-3">
                        {p.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[#C9A84C] font-black">{formatFCFA(p.prix_fcfa)}</span>
                          <span className="text-[#F5F0E8]/20 text-xs">·</span>
                          <span className="text-[#F5F0E8]/30 text-xs">{formatDuration(p.duree_min)}</span>
                        </div>
                        <Link
                          href="/reserver"
                          className="text-xs font-bold text-[#C9A84C] border border-[#C9A84C]/30 px-3 py-1.5 rounded-full hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all"
                        >
                          Réserver
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* ── EN SALON ──────────────────────────────────────────── */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">✨</span>
            <h2 className="text-2xl font-black text-[#F5F0E8]">En salon</h2>
            <div className="flex-1 h-px bg-[#2A2A2A]" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">

            {/* Boissons */}
            <Link
              href="/boissons"
              className="group bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#E8A020]/40 transition-all flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: "#E8A02015", border: "1px solid #E8A02030" }}>
                🧃
              </div>
              <div className="flex-1">
                <h3 className="font-black text-[#F5F0E8] mb-1">Boissons &amp; Rafraîchissements</h3>
                <p className="text-[#F5F0E8]/40 text-xs leading-relaxed mb-3">
                  Commande depuis ton téléphone pendant l&apos;attente.
                  Dafani (300 F), Fanta · Coca · Sprite (500 F), Eau Lafi (200 F).
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F0E8]/30 text-xs">Dès 200 FCFA</span>
                  <span className="text-xs font-bold text-[#E8A020] group-hover:text-[#F0B830] transition-colors">
                    Commander →
                  </span>
                </div>
              </div>
            </Link>

            {/* Haircut Replay */}
            <Link
              href="/haircut-replay"
              className="group bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#C9A84C]/40 transition-all flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-2xl shrink-0">
                🔄
              </div>
              <div className="flex-1">
                <h3 className="font-black text-[#F5F0E8] mb-1">Haircut Replay</h3>
                <p className="text-[#F5F0E8]/40 text-xs leading-relaxed mb-3">
                  Suis tes réductions par semaine &amp; par mois, tes dépenses, ta fidélité.
                  3 mini-jeux disponibles pendant l&apos;attente.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F0E8]/30 text-xs">Gratuit · Disponible maintenant</span>
                  <span className="text-xs font-bold text-[#C9A84C] group-hover:text-[#E2C47A] transition-colors">
                    Accéder →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-[#1A1000] to-[#0A0A0A] border border-[#C9A84C]/30 rounded-2xl p-8 text-center">
          <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">Prêt ?</p>
          <h3 className="text-2xl font-black text-[#F5F0E8] mb-2">
            Réserve ton créneau
          </h3>
          <p className="text-[#F5F0E8]/40 text-sm mb-6">
            En ligne · 24h/24 · ZAD ou SAABA
          </p>
          <Link
            href="/reserver"
            className="inline-block bg-[#C9A84C] text-[#0A0A0A] font-black px-10 py-4 rounded-full hover:bg-[#E2C47A] transition-all"
          >
            Réserver maintenant 💈
          </Link>
        </div>

      </div>
    </main>
  );
}
