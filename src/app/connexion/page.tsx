"use client";
import { useActionState } from "react";
import { connexion } from "@/app/actions/auth";
import Image from "next/image";
import Link from "next/link";

export default function ConnexionPage() {
  const [state, action, pending] = useActionState(connexion, null);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#C9A84C]/40 mb-4">
            <Image src="/images/logo.jpg" alt="Renoï Barberstreet" fill sizes="64px" className="object-cover" />
          </div>
          <h1 className="text-2xl font-black text-[#F5F0E8]">Mon compte</h1>
          <p className="text-[#F5F0E8]/40 text-sm mt-1">Accédez à votre espace fidélité</p>
        </div>

        <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6">
          <form action={action} className="space-y-4">
            <div>
              <label className="block text-xs text-[#F5F0E8]/40 uppercase tracking-widest mb-2">
                Votre nom
              </label>
              <input
                name="nom"
                type="text"
                placeholder="Ex : Kader Sawadogo"
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/30 placeholder:text-[#F5F0E8]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs text-[#F5F0E8]/40 uppercase tracking-widest mb-2">
                Téléphone (WhatsApp) *
              </label>
              <input
                name="telephone"
                type="tel"
                required
                placeholder="+226 07 XX XX XX"
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/30 placeholder:text-[#F5F0E8]/20 transition-all"
              />
            </div>

            {state?.error && (
              <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-[#C9A84C] text-[#0A0A0A] font-black py-3 rounded-xl hover:bg-[#E2C47A] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {pending ? (
                <><div className="w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" /> Connexion...</>
              ) : "Se connecter →"}
            </button>
          </form>

          <p className="text-center text-xs text-[#F5F0E8]/20 mt-4 leading-relaxed">
            En production, un code de vérification sera envoyé par SMS.
          </p>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-[#F5F0E8]/30 text-sm hover:text-[#C9A84C] transition-colors">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
