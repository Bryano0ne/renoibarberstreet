"use client";
import { useActionState } from "react";
import { gerantConnexion } from "@/app/actions/gerant";
import Image from "next/image";

export default function GerantConnexionPage() {
  const [state, action, pending] = useActionState(gerantConnexion, null);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#C9A84C]/40 mb-4">
            <Image src="/images/logo.jpg" alt="RENOI" fill sizes="64px" className="object-cover" />
          </div>
          <h1 className="text-2xl font-black text-[#F5F0E8]">Espace Gérant</h1>
          <p className="text-[#F5F0E8]/40 text-sm mt-1">Dashboard administrateur</p>
        </div>

        <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6">
          <form action={action} className="space-y-4">
            <div>
              <label className="block text-xs text-[#F5F0E8]/40 uppercase tracking-widest mb-2">
                Mot de passe
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/30 transition-all"
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
                <><div className="w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />Connexion...</>
              ) : "Accéder au dashboard →"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
