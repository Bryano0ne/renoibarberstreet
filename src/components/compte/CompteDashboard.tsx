"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatFCFA } from "@/lib/utils";

interface Reservation {
  id: string;
  salon: string;
  prestation: string;
  prix_fcfa: number;
  date: string;
  heure: string;
  barbier: string;
  statut: string;
  note: number | null;
}

const MOIS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

function dateShort(d: string) {
  const [y, m, day] = d.split("-");
  return `${Number(day)} ${MOIS[Number(m) - 1]} ${y}`;
}

// ── Carte fidélité numérique ──────────────────────────────────
function CarteFidelite({ total, clientNom }: { total: number; clientNom: string }) {
  const TAMPONS = 10;
  const carteNum = String(Math.floor(total / TAMPONS) + 1).padStart(3, "0");
  const remplis = total % TAMPONS;
  const offerte = remplis === 0 && total > 0;

  return (
    <div className="mb-8">
      {/* Carte principale — format paysage */}
      <div
        className="relative overflow-hidden rounded-3xl w-full"
        style={{
          background: "linear-gradient(135deg, #1C1000 0%, #110900 45%, #0A0800 100%)",
          border: "1px solid rgba(201,168,76,0.35)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
          minHeight: 220,
        }}
      >
        {/* Fond points */}
        <div className="absolute inset-0 opacity-[0.045]" style={{
          backgroundImage: "radial-gradient(circle, #C9A84C 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }} />

        {/* Orbe lumière haut-droite */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.13) 0%, transparent 65%)" }} />
        {/* Orbe bas-gauche */}
        <div className="absolute -bottom-24 -left-12 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 65%)" }} />

        {/* Ligne diagonale déco */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[200%] h-px bg-gradient-to-r from-transparent via-[#C9A84C]/15 to-transparent"
            style={{ top: "38%", left: "-50%", transform: "rotate(-8deg)" }} />
        </div>

        <div className="relative z-10 p-6 flex flex-col" style={{ minHeight: 220 }}>

          {/* ── HAUT : Logo + marque + numéro ── */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              {/* Logo circulaire */}
              <div
                className="relative shrink-0 rounded-full overflow-hidden"
                style={{
                  width: 46, height: 46,
                  border: "2px solid rgba(201,168,76,0.55)",
                  boxShadow: "0 0 16px rgba(201,168,76,0.28), 0 0 32px rgba(201,168,76,0.10)",
                }}
              >
                <Image src="/images/logo.jpg" alt="RENOI" fill sizes="46px" className="object-cover" />
              </div>
              {/* Texte marque */}
              <div className="leading-none">
                <p className="text-[#C9A84C] font-black text-base tracking-[0.25em] uppercase">RENOI</p>
                <p className="text-[#F5F0E8]/35 text-[9px] tracking-[0.35em] uppercase mt-0.5">Barberstreet</p>
              </div>
            </div>

            {/* Numéro carte haut-droite */}
            <div className="text-right">
              <p className="text-[#F5F0E8]/25 text-[9px] tracking-[0.3em] uppercase">Programme</p>
              <p className="text-[#F5F0E8]/25 text-[9px] tracking-[0.3em] uppercase">Fidélité</p>
            </div>
          </div>

          {/* ── MILIEU : Tampons 5×2 ── */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-5 gap-2.5 mb-1">
              {Array.from({ length: TAMPONS }).map((_, i) => {
                const filled = offerte || i < remplis;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-center rounded-full transition-all"
                    style={{
                      aspectRatio: "1",
                      background: filled
                        ? "linear-gradient(145deg, #E2C47A 0%, #C9A84C 50%, #A07830 100%)"
                        : "rgba(201,168,76,0.07)",
                      border: filled
                        ? "1.5px solid rgba(226,196,122,0.7)"
                        : "1.5px solid rgba(201,168,76,0.18)",
                      boxShadow: filled
                        ? "0 0 10px rgba(201,168,76,0.45), inset 0 1px 0 rgba(255,255,255,0.15)"
                        : "none",
                    }}
                  >
                    {filled ? (
                      <span style={{ fontSize: 13, color: "#0A0A0A", fontWeight: 900, lineHeight: 1 }}>✂</span>
                    ) : (
                      <span style={{ fontSize: 9, color: "rgba(201,168,76,0.22)", fontWeight: 700 }}>{i + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── BAS : Nom + carte n° ── */}
          <div className="flex items-end justify-between mt-4 pt-3"
            style={{ borderTop: "1px solid rgba(201,168,76,0.12)" }}>
            <div>
              {offerte && (
                <span className="inline-block bg-[#C9A84C] text-[#0A0A0A] text-[10px] font-black px-2 py-0.5 rounded-full mb-1.5 tracking-wide">
                  🎉 COUPE OFFERTE
                </span>
              )}
              <p className="text-[#F5F0E8]/25 text-[9px] tracking-[0.35em] uppercase mb-0.5">Titulaire</p>
              <p className="text-[#F5F0E8] font-black text-sm tracking-[0.15em] uppercase">
                {clientNom}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[#F5F0E8]/20 text-[9px] tracking-[0.25em] uppercase mb-0.5">Carte</p>
              <p className="text-[#C9A84C] font-black text-sm tracking-[0.2em]">N° {carteNum}</p>
              {!offerte && (
                <p className="text-[#F5F0E8]/25 text-[9px] mt-0.5">
                  {remplis}/{TAMPONS} · encore {TAMPONS - remplis}
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Modal notation ─────────────────────────────────────────────
function ModalAvis({ resa, onClose, onSubmit }: {
  resa: Reservation;
  onClose: () => void;
  onSubmit: (id: string, note: number, comment: string) => void;
}) {
  const [note, setNote] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!note) return;
    setSending(true);
    await fetch("/api/avis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reservation_id: resa.id, note, commentaire: comment }),
    });
    onSubmit(resa.id, note, comment);
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-black text-[#F5F0E8] mb-1">Notez votre expérience</h3>
        <p className="text-[#F5F0E8]/40 text-sm mb-6">{resa.prestation} · {resa.barbier} · {dateShort(resa.date)}</p>

        {/* Étoiles */}
        <div className="flex justify-center gap-3 mb-6">
          {[1, 2, 3, 4, 5].map(s => (
            <button
              key={s}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setNote(s)}
              className="text-3xl transition-transform hover:scale-125"
            >
              <span className={(hover || note) >= s ? "text-[#C9A84C]" : "text-[#2A2A2A]"}>★</span>
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Votre commentaire (optionnel)..."
          rows={3}
          className="w-full bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] focus:outline-none resize-none placeholder:text-[#F5F0E8]/20 mb-4"
        />

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-[#2A2A2A] text-[#F5F0E8]/40 rounded-xl text-sm hover:border-[#3A3A3A] transition-all">
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={!note || sending}
            className="flex-1 py-3 bg-[#C9A84C] text-[#0A0A0A] font-black rounded-xl text-sm disabled:opacity-40 hover:bg-[#E2C47A] transition-all"
          >
            {sending ? "..." : "Publier ★"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard principal ────────────────────────────────────────
export default function CompteDashboard({ clientId, clientNom }: { clientId: string; clientNom: string }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalResa, setModalResa] = useState<Reservation | null>(null);
  const [notesLocales, setNotesLocales] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/compte/reservations")
      .then(r => r.json())
      .then((data: Reservation[]) => { setReservations(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleNoteSubmit = (id: string, note: number) => {
    setNotesLocales(prev => ({ ...prev, [id]: note }));
    setModalResa(null);
  };

  const totalCoupes = reservations.length;
  const totalDepense = reservations.reduce((s, r) => s + r.prix_fcfa, 0);
  // Points : 1 pt par 100 FCFA dépensés
  const points = Math.floor(totalDepense / 100);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Carte fidélité */}
      <CarteFidelite total={totalCoupes} clientNom={clientNom} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "Coupes", value: totalCoupes, icon: "✂️" },
          { label: "Dépensé", value: formatFCFA(totalDepense), icon: "💰" },
          { label: "Points", value: `${points} pts`, icon: "⭐" },
        ].map(s => (
          <div key={s.label} className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-4 text-center">
            <div className="text-xl mb-1">{s.icon}</div>
            <p className="text-[#C9A84C] font-black text-sm">{s.value}</p>
            <p className="text-[#F5F0E8]/30 text-[10px] uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Points info */}
      {points >= 100 && (
        <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl p-4 mb-8 flex items-center justify-between">
          <div>
            <p className="text-[#C9A84C] font-black text-sm">🎁 {points} points disponibles</p>
            <p className="text-[#F5F0E8]/40 text-xs mt-0.5">100 pts = {formatFCFA(500)} de réduction sur votre prochaine coupe</p>
          </div>
          <span className="text-[#C9A84C] text-2xl">→</span>
        </div>
      )}

      {/* CTA réserver */}
      <Link
        href="/reserver"
        className="flex items-center justify-center gap-2 w-full bg-[#C9A84C] text-[#0A0A0A] font-black py-4 rounded-xl mb-8 hover:bg-[#E2C47A] transition-all"
      >
        ✂️ Réserver un créneau
      </Link>

      {/* Historique */}
      <div>
        <h2 className="text-sm font-black text-[#F5F0E8] uppercase tracking-widest mb-4">Historique</h2>

        {reservations.length === 0 ? (
          <p className="text-center text-[#F5F0E8]/25 text-sm py-8">Aucune réservation pour l&apos;instant.</p>
        ) : (
          <div className="space-y-3">
            {reservations.map(r => {
              const noteAffichee = notesLocales[r.id] ?? r.note;
              return (
                <div key={r.id} className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#F5F0E8] font-semibold text-sm truncate">{r.prestation}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          r.statut === "terminee" ? "bg-green-500/10 text-green-400" : "bg-[#C9A84C]/10 text-[#C9A84C]"
                        }`}>
                          {r.statut === "terminee" ? "Terminée" : "À venir"}
                        </span>
                      </div>
                      <p className="text-[#F5F0E8]/30 text-xs">
                        {dateShort(r.date)} · {r.heure} · Salon {r.salon} · {r.barbier}
                      </p>
                      {noteAffichee && (
                        <p className="text-[#C9A84C] text-xs mt-1">
                          {"★".repeat(noteAffichee)}{"☆".repeat(5 - noteAffichee)}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[#C9A84C] font-black text-sm">{formatFCFA(r.prix_fcfa)}</p>
                      {r.statut === "terminee" && !noteAffichee && (
                        <button
                          onClick={() => setModalResa(r)}
                          className="text-[10px] text-[#F5F0E8]/30 hover:text-[#C9A84C] mt-1 transition-colors underline underline-offset-2"
                        >
                          Noter
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal avis */}
      {modalResa && (
        <ModalAvis
          resa={modalResa}
          onClose={() => setModalResa(null)}
          onSubmit={handleNoteSubmit}
        />
      )}
    </>
  );
}
