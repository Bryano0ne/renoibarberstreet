"use client";
export default function OfflinePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-8">
        <div className="w-24 h-24 rounded-full bg-[#111111] border-2 border-[#C9A84C]/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✂️</span>
        </div>
        <h1 className="text-3xl font-black text-[#F5F0E8] mb-2 tracking-wide">
          RENOÏ
        </h1>
        <p className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase mb-8">Barberstreet</p>
      </div>

      <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-8 max-w-sm w-full">
        <div className="text-4xl mb-4">📡</div>
        <h2 className="text-xl font-black text-[#F5F0E8] mb-3">Pas de connexion</h2>
        <p className="text-[#F5F0E8]/50 text-sm leading-relaxed mb-6">
          Tu es actuellement hors ligne. Vérifie ta connexion réseau puis réessaie.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-[#C9A84C] text-[#0A0A0A] font-black py-3 rounded-xl text-sm hover:bg-[#E2C47A] transition-all"
        >
          Réessayer
        </button>
      </div>

      <div className="mt-8 space-y-2 text-center">
        <p className="text-[#F5F0E8]/20 text-xs">Pour nous joindre sans internet :</p>
        <div className="flex flex-col gap-1">
          <a href="tel:+22600000000" className="text-[#C9A84C] text-sm font-semibold">Salon ZAD — +226 00 00 00 00</a>
          <a href="tel:+22600000001" className="text-[#C9A84C] text-sm font-semibold">Salon SAABA — +226 00 00 00 01</a>
        </div>
      </div>
    </main>
  );
}
