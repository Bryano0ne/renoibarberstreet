import Link from "next/link";
import Image from "next/image";
import { BRAND, SALONS } from "@/lib/constants";
import { PRESTATIONS_DEMO, BARBIERS_DEMO, AVIS_DEMO } from "@/lib/demo-data";
import { formatFCFA, formatDuration } from "@/lib/utils";

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

const GALERIE_PHOTOS = [
  { src: "/images/galerie/tapers-fades.jpg",       alt: "Tapers & Fades" },
  { src: "/images/galerie/twist-locks.jpg",         alt: "Twist & Locks" },
  { src: "/images/prestations/degrade-classique.jpg", alt: "Dégradé Classique" },
  { src: "/images/prestations/afro-sculpte.jpg",    alt: "Afro Sculpté" },
  { src: "/images/prestations/combo-coupe-barbe.jpg", alt: "Combo Coupe + Barbe" },
  { src: "/images/prestations/rasage-traditionnel.jpg", alt: "Rasage Traditionnel" },
];

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

const schemaOrg = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: "RENOI Barberstreet",
  description: "Barbershop urbain premium à Ouagadougou, Burkina Faso. La valeur sûre.",
  url: process.env.NEXT_PUBLIC_APP_URL,
  telephone: "+22667912222",
  openingHours: "Mo-Su 09:00-21:00",
  address: {
    "@type": "PostalAddress",
    streetAddress: "En face du Black Diamond & station ACCESS OIL",
    addressLocality: "Ouagadougou",
    addressCountry: "BF",
  },
  sameAs: [
    "https://www.instagram.com/renoi_barberstreet/",
    "https://www.instagram.com/renoi_barberstreet_saaba/",
  ],
};

export default function HomePage() {
  const featuredPrestations = PRESTATIONS_DEMO.slice(0, 3);
  const featuredAvis = AVIS_DEMO.slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <main className="flex flex-col">

        {/* ── HERO ── */}
        <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 pt-16 overflow-hidden">

          {/* Photo du salon — Ken Burns */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-salon.jpg"
              alt="Intérieur RENOI Barberstreet"
              fill
              className="object-cover animate-kenburns"
              priority
              quality={90}
            />
            {/* Calques sombres pour lisibilité du texte */}
            <div className="absolute inset-0 bg-[#0A0A0A]/65" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-[#0A0A0A]/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-transparent to-[#0A0A0A]" />
          </div>

          {/* Contenu */}
          <div className="relative z-10 max-w-4xl mx-auto">

            <div className="animate-fadeinup inline-flex items-center gap-2 bg-[#0A0A0A]/70 border border-[#C9A84C]/30 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-[#F5F0E8]/70 tracking-widest uppercase">
                Ouvert · 9h00 – 21h00 · 7j/7
              </span>
            </div>

            {/* Logo + Nom centré */}
            <div className="animate-fadeinup-delay flex flex-col items-center gap-4 mb-6">
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-[#C9A84C]/60 shadow-2xl shadow-[#C9A84C]/20">
                <Image
                  src="/images/logo.jpg"
                  alt="Logo RENOI Barberstreet"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <p className="text-[#C9A84C] text-xs tracking-[0.5em] uppercase">
                Ouagadougou · ZAD & SAABA
              </p>
            </div>

            <h1 className="animate-fadeinup-delay text-6xl md:text-8xl font-black tracking-tight text-[#F5F0E8] leading-none mb-4 drop-shadow-2xl">
              RENOI<br />
              <span className="text-[#C9A84C]">BARBERSTREET</span>
            </h1>
            <p className="animate-fadeinup-delay2 text-lg md:text-xl text-[#F5F0E8]/60 mb-10 italic drop-shadow-lg">
              &ldquo;{BRAND.slogan}&rdquo; 💈
            </p>

            <div className="animate-fadeinup-delay2 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/reserver"
                className="bg-[#C9A84C] text-[#0A0A0A] font-black px-10 py-4 rounded-full text-lg hover:bg-[#E2C47A] transition-all hover:scale-105 shadow-2xl shadow-[#C9A84C]/30"
              >
                Réserver maintenant
              </Link>
              <Link
                href="/prestations"
                className="border border-[#C9A84C]/60 text-[#C9A84C] font-bold px-10 py-4 rounded-full text-lg hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 backdrop-blur-sm transition-all"
              >
                Voir nos coupes
              </Link>
            </div>
          </div>

          {/* Flèche scroll */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-10">
            <div className="w-px h-10 bg-gradient-to-b from-[#C9A84C]/60 to-transparent mx-auto" />
          </div>
        </section>

        {/* ── BANDEAU DÉFILANT ── */}
        <div className="border-y border-[#2A2A2A] overflow-hidden py-3 bg-[#0A0A0A]">
          <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap">
            {Array(6).fill(null).map((_, i) => (
              <span key={i} className="mx-8 text-sm text-[#F5F0E8]/30 tracking-widest uppercase">
                La valeur sûre 💈 &nbsp;·&nbsp; ZAD &nbsp;·&nbsp; SAABA &nbsp;·&nbsp; 9h–21h &nbsp;·&nbsp; 7j/7 &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* ── CHIFFRES CLÉS ── */}
        <section className="py-20 px-6 bg-[#0A0A0A]">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "Clients satisfaits" },
              { value: "2", label: "Salons Ouagadougou" },
              { value: "7j/7", label: "Toujours ouverts" },
              { value: "4.9 ⭐", label: "Note moyenne" },
            ].map((item) => (
              <div key={item.label} className="group">
                <div className="text-4xl md:text-5xl font-black text-[#C9A84C] group-hover:scale-110 transition-transform">
                  {item.value}
                </div>
                <div className="text-xs text-[#F5F0E8]/40 mt-2 uppercase tracking-widest">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRESTATIONS APERÇU ── */}
        <section className="py-20 px-6 border-t border-[#2A2A2A]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">Nos services</p>
              <h2 className="text-4xl font-black text-[#F5F0E8]">
                Coupes & <span className="text-[#C9A84C]">Prestations</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {featuredPrestations.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#C9A84C]/40 transition-all group"
                >
                  <div className="aspect-video bg-[#1A1A1A] rounded-xl mb-5 overflow-hidden relative">
                    {PRESTATION_PHOTOS[p.id] ? (
                      <Image
                        src={PRESTATION_PHOTOS[p.id]}
                        alt={p.nom}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="flex items-center justify-center w-full h-full text-5xl opacity-30 group-hover:opacity-60 transition-opacity">💈</span>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-[#F5F0E8] text-lg">{p.nom}</h3>
                    {p.badge && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${BADGE_STYLES[p.badge]}`}>
                        {BADGE_LABELS[p.badge]}
                      </span>
                    )}
                  </div>
                  <p className="text-[#F5F0E8]/50 text-sm mb-4 leading-relaxed">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#C9A84C] font-black text-xl">{formatFCFA(p.prix_fcfa)}</span>
                      <span className="text-[#F5F0E8]/30 text-xs ml-2">{formatDuration(p.duree_min)}</span>
                    </div>
                    <Link
                      href="/reserver"
                      className="text-xs font-semibold text-[#C9A84C] border border-[#C9A84C]/30 px-3 py-1.5 rounded-full hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all"
                    >
                      Réserver
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/prestations"
                className="inline-flex items-center gap-2 text-[#C9A84C] border border-[#C9A84C]/30 px-8 py-3 rounded-full hover:bg-[#C9A84C]/10 transition-all font-semibold"
              >
                Voir toutes les prestations →
              </Link>
            </div>
          </div>
        </section>

        {/* ── ÉQUIPE APERÇU ── */}
        <section className="py-20 px-6 border-t border-[#2A2A2A] bg-[#080808]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">Nos artistes</p>
              <h2 className="text-4xl font-black text-[#F5F0E8]">
                Notre <span className="text-[#C9A84C]">Équipe</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {BARBIERS_DEMO.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5 text-center hover:border-[#C9A84C]/40 transition-all group"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C9A84C]/20 to-[#8B2500]/20 border-2 border-[#2A2A2A] mx-auto mb-4 flex items-center justify-center group-hover:border-[#C9A84C]/50 transition-all">
                    <span className="text-3xl">💈</span>
                  </div>
                  <h3 className="font-bold text-[#F5F0E8] text-base mb-1">{b.prenom}</h3>
                  <span className="inline-block text-xs text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded-full mb-3">
                    {b.salon_nom}
                  </span>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {b.specialites.map((s) => (
                      <span key={s} className="text-xs text-[#F5F0E8]/40 bg-[#1A1A1A] px-2 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/equipe"
                className="inline-flex items-center gap-2 text-[#C9A84C] border border-[#C9A84C]/30 px-8 py-3 rounded-full hover:bg-[#C9A84C]/10 transition-all font-semibold"
              >
                Voir toute l&apos;équipe →
              </Link>
            </div>
          </div>
        </section>

        {/* ── GALERIE ── */}
        <section className="py-20 px-6 border-t border-[#2A2A2A]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">Nos réalisations</p>
              <h2 className="text-4xl font-black text-[#F5F0E8]">
                La <span className="text-[#C9A84C]">Galerie</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
              {GALERIE_PHOTOS.map((photo, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden border border-[#2A2A2A] hover:border-[#C9A84C]/40 transition-all group cursor-pointer relative bg-[#111111]"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>

            <div className="text-center">
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Voir plus sur Instagram
              </a>
            </div>
          </div>
        </section>

        {/* ── EXPÉRIENCE RENOI ── */}
        <section className="py-20 px-6 border-t border-[#2A2A2A] bg-[#080808]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">
                Pendant ton passage
              </p>
              <h2 className="text-4xl font-black text-[#F5F0E8]">
                L&apos;<span className="text-[#C9A84C]">Expérience</span> RENOI
              </h2>
              <p className="text-[#F5F0E8]/30 text-sm mt-3">
                Commander, suivre ta fidélité, jouer — tout depuis ton téléphone.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Boissons */}
              <Link
                href="/boissons"
                className="group bg-[#111111] border border-[#2A2A2A] rounded-2xl p-8 hover:border-[#C9A84C]/40 transition-all flex flex-col"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#E8A020]/10 border border-[#E8A020]/20 flex items-center justify-center text-3xl mb-5">
                  🧃
                </div>
                <h3 className="text-2xl font-black text-[#F5F0E8] mb-2">Boissons</h3>
                <p className="text-[#F5F0E8]/40 text-sm leading-relaxed mb-6 flex-1">
                  Commande ta boisson depuis ton téléphone pendant l&apos;attente.
                  Dafani, Coca-Cola, Fanta, Sprite, Eau Lafi — servi directement à ta place.
                </p>
                <div className="flex items-center gap-2 text-sm font-black text-[#C9A84C] group-hover:gap-3 transition-all">
                  Commander maintenant <span className="text-lg">→</span>
                </div>
              </Link>

              {/* Haircut Replay */}
              <Link
                href="/haircut-replay"
                className="group bg-[#111111] border border-[#2A2A2A] rounded-2xl p-8 hover:border-[#C9A84C]/40 transition-all flex flex-col"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-3xl mb-5">
                  🔄
                </div>
                <h3 className="text-2xl font-black text-[#F5F0E8] mb-2">Haircut Replay</h3>
                <p className="text-[#F5F0E8]/40 text-sm leading-relaxed mb-6 flex-1">
                  Suis tes réductions par semaine et par mois, tes dépenses, ta progression
                  fidélité. Et si l&apos;attente se prolonge — 3 mini-jeux à portée de doigt.
                </p>
                <div className="flex items-center gap-2 text-sm font-black text-[#C9A84C] group-hover:gap-3 transition-all">
                  Voir mon Replay <span className="text-lg">→</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ── AVIS CLIENTS ── */}
        <section className="py-20 px-6 border-t border-[#2A2A2A] bg-[#080808]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">Ils nous font confiance</p>
              <h2 className="text-4xl font-black text-[#F5F0E8]">
                Avis <span className="text-[#C9A84C]">Clients</span>
              </h2>
              <p className="text-[#F5F0E8]/40 mt-3">⭐⭐⭐⭐⭐ — 4.9 / 5 · 200+ avis</p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {featuredAvis.map((avis) => (
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
                    <span className="text-xs text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded-full">
                      {avis.salon}
                    </span>
                  </div>
                  <p className="text-[#F5F0E8]/70 text-sm leading-relaxed mb-4 italic">
                    &ldquo;{avis.commentaire}&rdquo;
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#F5F0E8] text-sm">{avis.prenom}</span>
                    <span className="text-xs text-[#F5F0E8]/30">{avis.date}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/avis"
                className="inline-flex items-center gap-2 text-[#C9A84C] border border-[#C9A84C]/30 px-8 py-3 rounded-full hover:bg-[#C9A84C]/10 transition-all font-semibold"
              >
                Voir tous les avis →
              </Link>
            </div>
          </div>
        </section>

        {/* ── NOS ADRESSES ── */}
        <section className="py-20 px-6 border-t border-[#2A2A2A]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">Où nous trouver</p>
              <h2 className="text-4xl font-black text-[#F5F0E8]">
                Nos <span className="text-[#C9A84C]">Salons</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.values(SALONS).map((salon) => (
                <div
                  key={salon.id}
                  className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-7 hover:border-[#C9A84C]/40 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl flex items-center justify-center">
                      <span className="text-lg">📍</span>
                    </div>
                    <h3 className="text-xl font-black text-[#C9A84C]">{salon.nom}</h3>
                  </div>
                  <p className="text-[#F5F0E8]/60 text-sm mb-1 leading-relaxed">{salon.adresse}</p>
                  <p className="text-[#F5F0E8]/30 text-sm mb-5">{salon.horaires}</p>
                  <div className="flex flex-col gap-2">
                    <a
                      href={`tel:${salon.telephone}`}
                      className="inline-flex items-center gap-2 text-[#C9A84C] font-semibold text-sm hover:underline"
                    >
                      📞 {salon.telephone}
                    </a>
                    <a
                      href={salon.googleMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#F5F0E8]/40 text-sm hover:text-[#C9A84C] transition-colors"
                    >
                      🗺️ Voir sur Google Maps →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="py-24 px-6 border-t border-[#2A2A2A] text-center bg-gradient-to-b from-[#0A0A0A] to-[#0d0800]">
          <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4">Prêt ?</p>
          <h2 className="text-4xl md:text-5xl font-black text-[#F5F0E8] mb-4">
            Réserve ta prochaine coupe
          </h2>
          <p className="text-[#F5F0E8]/40 mb-10 max-w-md mx-auto">
            Rapide, en ligne, 24h/24. Ton barbier t&apos;attend à ZAD ou SAABA.
          </p>
          <Link
            href="/reserver"
            className="inline-block bg-[#C9A84C] text-[#0A0A0A] font-black px-12 py-5 rounded-full text-xl hover:bg-[#E2C47A] transition-all hover:scale-105 shadow-2xl shadow-[#C9A84C]/20"
          >
            Réserver maintenant 💈
          </Link>
        </section>

      </main>

    </>
  );
}
