"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/prestations", label: "Prestations" },
  { href: "/equipe", label: "Équipe" },
  { href: "/galerie", label: "Galerie" },
  { href: "/nos-salons", label: "Nos salons" },
  { href: "/avis", label: "Avis" },
  { href: "/compte", label: "Mon compte" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#2A2A2A]">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">

        {/* Logo + Nom */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#C9A84C]/40 group-hover:border-[#C9A84C] transition-all shrink-0">
            <Image
              src="/images/logo.jpg"
              alt="Renoï Barberstreet Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[#C9A84C] font-black text-sm tracking-widest uppercase group-hover:text-[#E2C47A] transition-colors">
              RENOI
            </span>
            <span className="text-[#F5F0E8]/50 text-[10px] tracking-[0.2em] uppercase -mt-0.5">
              Barberstreet
            </span>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${
                pathname === link.href
                  ? "text-[#C9A84C]"
                  : "text-[#F5F0E8]/60 hover:text-[#C9A84C]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/reserver"
            className="bg-[#C9A84C] text-[#0A0A0A] font-bold text-sm px-5 py-2 rounded-full hover:bg-[#E2C47A] transition-colors"
          >
            Réserver
          </Link>
          <button
            className="md:hidden text-[#F5F0E8] p-1"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav className="md:hidden bg-[#0A0A0A] border-t border-[#2A2A2A] px-6 py-4 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`py-3 text-base border-b border-[#1A1A1A] last:border-0 ${
                pathname === link.href ? "text-[#C9A84C]" : "text-[#F5F0E8]/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/compte"
            onClick={() => setOpen(false)}
            className="py-3 text-base text-[#F5F0E8]/70"
          >
            Mon compte
          </Link>
        </nav>
      )}
    </header>
  );
}
