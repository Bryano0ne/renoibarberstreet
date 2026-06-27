"use client";
import { useActionState } from "react";
import { barbierConnexion } from "@/app/actions/barbier";
import { BARBIERS_DEMO } from "@/lib/demo-data";
import Image from "next/image";

export default function BarbierConnexionPage() {
  const [state, action, pending] = useActionState(barbierConnexion, null);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#C9A84C]/40 mb-4">
            <Image src="/images/logo.jpg" alt="RENOI" fill sizes="64px" className="object-cover" />
          </div>
          <h1 className="text-2xl font-black text-[#F5F0E8]">Espace Barbier</h1>
          <p className="text-[#F5F0E8]/40 text-sm mt-1">Agenda · Statistiques · Créneaux</p>
        </div>

        <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6">
          <form action={action} className="space-y-4">
            <div>
              <label className="block text-xs text-[#F5F0E8]/40 uppercase tracking-widest mb-2">Votre nom</label>
              <select name="barbier_id" required
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] focus:outline-none transition-all cursor-pointer">
                <option value="">— Sélectionner —</option>
                {BARBIERS_DEMO.map(b => (
                  <option key={b.id} value={b.id}>{b.prenom} · Salon {b.salon_nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#F5F0E8]/40 uppercase tracking-widest mb-2">Code PIN</label>
              <input name="pin" type="password" inputMode="numeric" maxLength={4} placeholder="••••" required
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] focus:outline-none tracking-[0.5em] text-center transition-all" />
            </div>
            {state?.error && (
              <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{state.error}</p>
            )}
            <button type="submit" disabled={pending}
              className="w-full bg-[#C9A84C] text-[#0A0A0A] font-black py-3 rounded-xl hover:bg-[#E2C47A] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {pending ? <><div className="w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin"/>Connexion...</> : "Accéder à mon espace →"}
            </button>
          </form>
          <p className="text-center text-[10px] text-[#F5F0E8]/15 mt-4">PINs demo : 1111 / 2222 / 3333 / 4444</p>
        </div>
      </div>
    </main>
  );
}
