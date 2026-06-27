import type { Metadata } from "next";
import Tunnel from "@/components/reservation/Tunnel";

export const metadata: Metadata = {
  title: "Réserver | Renoï Barberstreet — Ouagadougou",
  description: "Réservez votre coupe en ligne en 2 minutes. Salon ZAD ou SAABA, disponible 7j/7 de 9h à 21h. Gratuit, sans engagement.",
};

export default function ReserverPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      {/* Hero section */}
      <div className="max-w-2xl mx-auto text-center mb-12">
        <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">Réservation en ligne</p>
        <h1 className="text-4xl sm:text-5xl font-black text-[#F5F0E8] mb-4 leading-tight">
          Réservez votre <span className="text-[#C9A84C]">créneau</span>
        </h1>
        <p className="text-[#F5F0E8]/40 text-sm leading-relaxed">
          Salon disponible 7j/7 de 9h à 21h · Pas de paiement requis · Confirmation par WhatsApp
        </p>
      </div>

      {/* Tunnel */}
      <Tunnel />
    </main>
  );
}
