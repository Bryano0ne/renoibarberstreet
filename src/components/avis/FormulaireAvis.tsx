"use client";
import { useState } from "react";

const SALONS = ["ZAD", "SAABA"] as const;

export default function FormulaireAvis() {
  const [prenom, setPrenom] = useState("");
  const [salon, setSalon] = useState<"ZAD" | "SAABA">("ZAD");
  const [note, setNote] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState("");

  const LABELS = ["", "Pas terrible", "Peut mieux faire", "Bien", "Très bien", "Excellent !"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    if (!note) { setErreur("Choisis une note."); return; }
    if (!prenom.trim()) { setErreur("Ton prénom est requis."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/avis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prenom: prenom.trim(), salon, note, commentaire }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur");
      setSucces(true);
    } catch (err: unknown) {
      setErreur(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  if (succes) {
    return (
      <div className="bg-gradient-to-br from-[#111111] to-[#0d0800] border border-[#C9A84C]/30 rounded-2xl p-10 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-2xl font-black text-[#F5F0E8] mb-2">Merci {prenom} !</h3>
        <p className="text-[#F5F0E8]/50 text-sm max-w-sm mx-auto">
          Ton avis a bien été enregistré. Il aide d&apos;autres clients à choisir RENOI Barberstreet.
        </p>
        <div className="flex justify-center gap-0.5 mt-4">
          {Array(note).fill("⭐").map((s, i) => <span key={i} className="text-lg">{s}</span>)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#111111] to-[#0d0800] border border-[#C9A84C]/20 rounded-2xl p-8">
      <div className="text-center mb-8">
        <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-2">Ton expérience compte</p>
        <h3 className="text-2xl font-black text-[#F5F0E8]">Laisse ton avis</h3>
        <p className="text-[#F5F0E8]/40 text-sm mt-2">
          Partage ton ressenti — sans compte nécessaire.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">

        {/* Étoiles */}
        <div className="text-center">
          <p className="text-[#F5F0E8]/40 text-xs uppercase tracking-widest mb-3">Note</p>
          <div className="flex justify-center gap-2 mb-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNote(n)}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(0)}
                className="text-3xl transition-transform hover:scale-110 active:scale-95"
                aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
              >
                <span style={{ filter: n <= (hovered || note) ? "none" : "grayscale(1) opacity(0.3)" }}>
                  ⭐
                </span>
              </button>
            ))}
          </div>
          {(hovered || note) > 0 && (
            <p className="text-[#C9A84C] text-sm font-semibold h-5 transition-all">
              {LABELS[hovered || note]}
            </p>
          )}
        </div>

        {/* Prénom */}
        <div>
          <label className="block text-[#F5F0E8]/50 text-xs uppercase tracking-widest mb-2">
            Prénom <span className="text-[#C9A84C]">*</span>
          </label>
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder="Ton prénom"
            maxLength={40}
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[#F5F0E8] placeholder-[#F5F0E8]/20 focus:outline-none focus:border-[#C9A84C]/60 transition-colors text-sm"
          />
        </div>

        {/* Salon */}
        <div>
          <label className="block text-[#F5F0E8]/50 text-xs uppercase tracking-widest mb-2">
            Salon visité
          </label>
          <div className="grid grid-cols-2 gap-3">
            {SALONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSalon(s)}
                className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                  salon === s
                    ? "bg-[#C9A84C] text-[#0A0A0A] border-[#C9A84C]"
                    : "border-[#2A2A2A] text-[#F5F0E8]/50 hover:border-[#C9A84C]/40 hover:text-[#C9A84C]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Commentaire */}
        <div>
          <label className="block text-[#F5F0E8]/50 text-xs uppercase tracking-widest mb-2">
            Commentaire <span className="text-[#F5F0E8]/20 font-normal normal-case">(optionnel)</span>
          </label>
          <textarea
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            placeholder="Dis-nous ce que tu as aimé, ou ce qu'on peut améliorer…"
            rows={4}
            maxLength={500}
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[#F5F0E8] placeholder-[#F5F0E8]/20 focus:outline-none focus:border-[#C9A84C]/60 transition-colors text-sm resize-none"
          />
          <p className="text-right text-[#F5F0E8]/20 text-xs mt-1">{commentaire.length}/500</p>
        </div>

        {/* Erreur */}
        {erreur && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm text-center">
            {erreur}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !note || !prenom.trim()}
          className="w-full bg-[#C9A84C] text-[#0A0A0A] font-black py-4 rounded-xl hover:bg-[#E2C47A] transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm tracking-wide"
        >
          {loading ? "Envoi en cours…" : "Publier mon avis →"}
        </button>
      </form>
    </div>
  );
}
