import Link from "next/link";
import { BRAND, SALONS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-[#2A2A2A] bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
        <div>
          <p className="text-[#C9A84C] font-black text-sm tracking-widest uppercase mb-2">
            RENOÏ // CITY BARBER
          </p>
          <p className="text-[#F5F0E8]/50 text-sm italic mb-6">
            &ldquo;{BRAND.slogan}&rdquo; 💈
          </p>
          <div className="flex flex-col gap-2">
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F5F0E8]/40 hover:text-[#C9A84C] text-sm transition-colors"
            >
              Instagram ZAD →
            </a>
            <a
              href={BRAND.instagramSaaba}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F5F0E8]/40 hover:text-[#C9A84C] text-sm transition-colors"
            >
              Instagram SAABA →
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-[#F5F0E8] font-semibold text-xs uppercase tracking-widest mb-5">
            Navigation
          </h4>
          <div className="flex flex-col gap-3">
            {[
              { href: "/prestations", label: "Nos Prestations" },
              { href: "/equipe", label: "Notre Équipe" },
              { href: "/galerie", label: "Galerie" },
              { href: "/nos-salons", label: "Nos Salons" },
              { href: "/reserver", label: "Réserver" },
              { href: "/avis", label: "Avis clients" },
              { href: "/cadeaux", label: "Cartes cadeaux" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[#F5F0E8]/50 hover:text-[#C9A84C] text-sm transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[#F5F0E8] font-semibold text-xs uppercase tracking-widest mb-5">
            Nos Salons
          </h4>
          <div className="flex flex-col gap-6">
            {Object.values(SALONS).map((salon) => (
              <div key={salon.id}>
                <p className="text-[#C9A84C] font-semibold text-sm mb-1">{salon.nom}</p>
                <p className="text-[#F5F0E8]/50 text-xs mb-2 leading-relaxed">{salon.adresse}</p>
                <a
                  href={`tel:${salon.telephone}`}
                  className="text-[#F5F0E8]/40 text-xs hover:text-[#C9A84C] transition-colors"
                >
                  {salon.telephone}
                </a>
              </div>
            ))}
            <p className="text-[#F5F0E8]/25 text-xs">Ouvert 7j/7 · 9h00 – 21h00</p>
          </div>
        </div>
      </div>

      <div className="border-t border-[#1A1A1A] px-6 py-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-[#F5F0E8]/20">
          <p>© {new Date().getFullYear()} Renoï // City Barber · Ouagadougou, Burkina Faso</p>
          <div className="flex gap-5">
            <Link href="/mentions-legales" className="hover:text-[#C9A84C] transition-colors">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="hover:text-[#C9A84C] transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
