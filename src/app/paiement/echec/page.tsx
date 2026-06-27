"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function EchecContent() {
  const params = useSearchParams();
  const id = params.get("id") || "";

  return (
    <div className="max-w-sm mx-auto text-center">
      <div className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mx-auto mb-6">
        <span className="text-5xl">✕</span>
      </div>
      <h1 className="text-2xl font-black text-[#F5F0E8] mb-2">Paiement échoué</h1>
      <p className="text-[#F5F0E8]/40 text-sm mb-8">
        Le paiement n&apos;a pas pu être traité. Votre réservation est conservée.
      </p>
      <div className="space-y-3">
        <Link
          href={`/paiement?id=${id}`}
          className="flex items-center justify-center w-full bg-[#C9A84C] text-[#0A0A0A] font-black py-3 rounded-xl hover:bg-[#E2C47A] transition-all text-sm"
        >
          Réessayer le paiement
        </Link>
        <Link href="/reserver" className="flex items-center justify-center w-full border border-[#2A2A2A] text-[#F5F0E8]/40 py-3 rounded-xl hover:border-[#3A3A3A] transition-all text-sm">
          Nouvelle réservation
        </Link>
      </div>
    </div>
  );
}

export default function PaiementEchecPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-16">
      <Suspense fallback={null}>
        <EchecContent />
      </Suspense>
    </main>
  );
}
