"use client";
import { useState, useEffect, useCallback } from "react";
import { SALONS } from "@/lib/constants";
import { formatFCFA } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────
type SalonId = "ZAD" | "SAABA";

interface Prestation {
  id: string;
  nom: string;
  categorie: string;
  prix_fcfa: number;
  duree_min: number;
  badge: string | null;
  description: string;
}

interface Slot {
  heure: string;
  disponible: boolean;
}

interface Reservation {
  id: string;
  salon: string;
  prestation: string;
  prix_fcfa: number;
  date: string;
  heure: string;
  client_nom: string;
  client_telephone: string;
  barbier: string;
}

type Step = 1 | 2 | 3 | 4 | 5;

// ─── Constantes ───────────────────────────────────────────────
const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MOIS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

const CATS = [
  { id: "tous", label: "Tout" },
  { id: "coupe", label: "Coupes" },
  { id: "barbe", label: "Barbe" },
  { id: "combo", label: "Combos" },
  { id: "soins", label: "Soins" },
  { id: "enfant", label: "Enfant" },
];

const SALON_PHONES: Record<SalonId, string> = {
  ZAD: "22667912222",
  SAABA: "22607952434",
};

function formatDateFR(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  const jourSemaine = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"][date.getDay()];
  return `${jourSemaine} ${Number(d)} ${MOIS[Number(m) - 1]} ${y}`;
}

// ─── Composant Étape indicateur ───────────────────────────────
function StepBar({ current }: { current: Step }) {
  const steps = [
    { n: 1, label: "Salon" },
    { n: 2, label: "Prestation" },
    { n: 3, label: "Créneau" },
    { n: 4, label: "Contact" },
    { n: 5, label: "Confirm." },
  ];
  return (
    <div className="flex items-center justify-between mb-8 px-2">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${
              current > s.n ? "bg-[#C9A84C] border-[#C9A84C] text-[#0A0A0A]" :
              current === s.n ? "border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/10" :
              "border-[#2A2A2A] text-[#F5F0E8]/25"
            }`}>
              {current > s.n ? "✓" : s.n}
            </div>
            <span className={`text-[10px] mt-1 tracking-wide hidden sm:block ${
              current === s.n ? "text-[#C9A84C]" : current > s.n ? "text-[#F5F0E8]/60" : "text-[#F5F0E8]/20"
            }`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px mx-1 mb-4 transition-all ${current > s.n ? "bg-[#C9A84C]" : "bg-[#2A2A2A]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Calendrier ───────────────────────────────────────────────
function Calendrier({ selected, onSelect }: { selected: string | null; onSelect: (d: string) => void }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // Lundi = 0
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalCells = startOffset + lastDay.getDate();
  const cells = Array.from({ length: Math.ceil(totalCells / 7) * 7 });

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  return (
    <div className="bg-[#111111] rounded-2xl p-4 border border-[#2A2A2A]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-8 h-8 rounded-full hover:bg-[#2A2A2A] flex items-center justify-center text-[#F5F0E8]/60 hover:text-[#C9A84C] transition-colors">
          ‹
        </button>
        <span className="text-sm font-semibold text-[#F5F0E8]">{MOIS[month]} {year}</span>
        <button onClick={nextMonth} className="w-8 h-8 rounded-full hover:bg-[#2A2A2A] flex items-center justify-center text-[#F5F0E8]/60 hover:text-[#C9A84C] transition-colors">
          ›
        </button>
      </div>

      {/* En-têtes jours */}
      <div className="grid grid-cols-7 mb-2">
        {JOURS.map(j => (
          <div key={j} className="text-center text-[10px] text-[#F5F0E8]/30 font-medium py-1">{j}</div>
        ))}
      </div>

      {/* Grille jours */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((_, idx) => {
          const dayNum = idx - startOffset + 1;
          if (dayNum < 1 || dayNum > lastDay.getDate()) {
            return <div key={idx} />;
          }
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
          const d = new Date(year, month, dayNum);
          const isPast = d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const isSelected = selected === dateStr;

          return (
            <button
              key={idx}
              disabled={isPast}
              onClick={() => onSelect(dateStr)}
              className={`aspect-square rounded-lg text-xs font-medium transition-all ${
                isSelected ? "bg-[#C9A84C] text-[#0A0A0A] font-black" :
                isPast ? "text-[#F5F0E8]/15 cursor-not-allowed" :
                "text-[#F5F0E8] hover:bg-[#C9A84C]/15 hover:text-[#C9A84C]"
              }`}
            >
              {dayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tunnel principal ─────────────────────────────────────────
export default function Tunnel() {
  const [step, setStep] = useState<Step>(1);
  const [salon, setSalon] = useState<SalonId | null>(null);
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [catFilter, setCatFilter] = useState("tous");
  const [prestation, setPrestation] = useState<Prestation | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [heure, setHeure] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [clientNom, setClientNom] = useState("");
  const [clientTel, setClientTel] = useState("");
  const [sending, setSending] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [error, setError] = useState("");

  // Charger prestations
  useEffect(() => {
    fetch("/api/prestations")
      .then(r => r.json())
      .then(setPrestations)
      .catch(() => null);
  }, []);

  // Charger créneaux quand date + salon changent
  useEffect(() => {
    if (!date || !salon) return;
    setLoadingSlots(true);
    setHeure(null);
    fetch(`/api/disponibilites?date=${date}&salon=${salon}`)
      .then(r => r.json())
      .then((data: Slot[]) => { setSlots(data); setLoadingSlots(false); })
      .catch(() => setLoadingSlots(false));
  }, [date, salon]);

  const next = () => setStep(s => Math.min(s + 1, 5) as Step);
  const back = () => setStep(s => Math.max(s - 1, 1) as Step);

  const handleConfirm = async () => {
    if (!salon || !prestation || !date || !heure || !clientNom.trim() || !clientTel.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salon, prestation_id: prestation.id, date, heure,
          client_nom: clientNom, client_telephone: clientTel,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur");
      setReservation(data.reservation);
      setStep(5);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setSending(false);
    }
  };

  const whatsappMsg = useCallback(() => {
    if (!reservation) return "";
    const msg = `Bonjour Renoï Barberstreet ! 👋\nJe viens de réserver en ligne :\n\n📅 ${formatDateFR(reservation.date)} à ${reservation.heure}\n✂️ ${reservation.prestation}\n📍 Salon ${reservation.salon}\n👤 ${reservation.client_nom}\n📞 ${reservation.client_telephone}\n\nRéférence : *${reservation.id}*`;
    return `https://wa.me/${SALON_PHONES[reservation.salon as SalonId]}?text=${encodeURIComponent(msg)}`;
  }, [reservation]);

  const reset = () => {
    setSalon(null); setPrestation(null); setDate(null);
    setHeure(null); setClientNom(""); setClientTel("");
    setReservation(null); setError(""); setStep(1);
  };

  const filteredPrestations = catFilter === "tous"
    ? prestations
    : prestations.filter(p => p.categorie === catFilter);

  // ── STEP 5 — Confirmation ──────────────────────────────────
  if (step === 5 && reservation) {
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-[#C9A84C]/10 border-2 border-[#C9A84C] flex items-center justify-center mx-auto mb-6 text-4xl">
          ✓
        </div>
        <h2 className="text-2xl font-black text-[#F5F0E8] mb-1">Réservation confirmée !</h2>
        <p className="text-[#F5F0E8]/50 text-sm mb-8">Vous allez recevoir une confirmation sur WhatsApp.</p>

        <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 text-left mb-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-[#F5F0E8]/40 text-sm">Référence</span>
            <span className="text-[#C9A84C] font-black text-sm">{reservation.id}</span>
          </div>
          <div className="h-px bg-[#2A2A2A]" />
          <div className="flex justify-between">
            <span className="text-[#F5F0E8]/40 text-sm">Salon</span>
            <span className="text-[#F5F0E8] font-semibold text-sm">Renoï {reservation.salon}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#F5F0E8]/40 text-sm">Date</span>
            <span className="text-[#F5F0E8] font-semibold text-sm">{formatDateFR(reservation.date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#F5F0E8]/40 text-sm">Heure</span>
            <span className="text-[#F5F0E8] font-semibold text-sm">{reservation.heure}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#F5F0E8]/40 text-sm">Prestation</span>
            <span className="text-[#F5F0E8] font-semibold text-sm">{reservation.prestation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#F5F0E8]/40 text-sm">Prix</span>
            <span className="text-[#C9A84C] font-black text-sm">{formatFCFA(reservation.prix_fcfa)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#F5F0E8]/40 text-sm">Barbier assigné</span>
            <span className="text-[#F5F0E8] font-semibold text-sm">{reservation.barbier}</span>
          </div>
        </div>

        {/* Payer maintenant */}
        <a
          href={reservation ? `/paiement?id=${reservation.id}&montant=${reservation.prix_fcfa}&prestation=${encodeURIComponent(reservation.prestation)}&salon=${reservation.salon}&nom=${encodeURIComponent(reservation.client_nom)}&tel=${encodeURIComponent(reservation.client_telephone)}&date=${reservation.date}&heure=${reservation.heure}&barbier=${encodeURIComponent(reservation.barbier)}` : "#"}
          className="flex items-center justify-center gap-2 w-full bg-[#C9A84C] text-[#0A0A0A] font-black py-4 rounded-xl mb-3 hover:bg-[#E2C47A] transition-colors"
        >
          💳 Payer maintenant — {reservation ? formatFCFA(reservation.prix_fcfa) : ""}
        </a>

        <a
          href={whatsappMsg()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full border border-[#25D366]/40 text-[#25D366] font-semibold py-3 rounded-xl mb-3 hover:bg-[#25D366]/10 transition-colors text-sm"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.108.549 4.088 1.512 5.81L.057 24l6.339-1.427A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.368l-.36-.213-3.731.84.855-3.63-.235-.374A9.82 9.82 0 0 1 2.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z"/></svg>
          Confirmer sur WhatsApp
        </a>

        <button onClick={reset} className="w-full border border-[#2A2A2A] text-[#F5F0E8]/30 font-semibold py-3 rounded-xl hover:border-[#C9A84C]/40 hover:text-[#C9A84C] transition-all text-sm">
          Nouvelle réservation
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <StepBar current={step} />

      {/* ── STEP 1 — Salon ── */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-black text-[#F5F0E8] mb-1">Choisissez votre salon</h2>
          <p className="text-[#F5F0E8]/40 text-sm mb-6">Les deux salons sont ouverts 7j/7 de 9h à 21h.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(["ZAD", "SAABA"] as SalonId[]).map((id) => {
              const s = SALONS[id];
              return (
                <button
                  key={id}
                  onClick={() => { setSalon(id); next(); }}
                  className={`relative text-left p-6 rounded-2xl border-2 transition-all group hover:border-[#C9A84C] hover:shadow-lg hover:shadow-[#C9A84C]/10 ${
                    salon === id ? "border-[#C9A84C] bg-[#C9A84C]/5" : "border-[#2A2A2A] bg-[#111111]"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C] text-lg font-black">
                      {id[0]}
                    </div>
                    <div>
                      <p className="font-black text-[#F5F0E8] text-base">Renoï {id}</p>
                      <p className="text-[10px] text-[#C9A84C] tracking-widest uppercase">Ouagadougou</p>
                    </div>
                  </div>
                  <p className="text-[#F5F0E8]/50 text-xs mb-3 leading-relaxed">{s.adresse}</p>
                  <div className="flex items-center gap-2 text-[#F5F0E8]/30 text-xs">
                    <span>📞</span>
                    <span>{s.telephone}</span>
                  </div>
                  <div className="absolute top-4 right-4 text-[#F5F0E8]/10 group-hover:text-[#C9A84C]/40 text-xl transition-colors">›</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── STEP 2 — Prestation ── */}
      {step === 2 && (
        <div>
          <button onClick={back} className="flex items-center gap-2 text-[#F5F0E8]/30 hover:text-[#C9A84C] text-sm mb-4 transition-colors">
            ‹ Retour
          </button>
          <h2 className="text-xl font-black text-[#F5F0E8] mb-1">Choisissez une prestation</h2>
          <p className="text-[#F5F0E8]/40 text-sm mb-5">Salon <span className="text-[#C9A84C] font-semibold">{salon}</span></p>

          {/* Filtres catégorie */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none">
            {CATS.map(c => (
              <button key={c.id} onClick={() => setCatFilter(c.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${
                  catFilter === c.id ? "bg-[#C9A84C] text-[#0A0A0A] border-[#C9A84C]" : "border-[#2A2A2A] text-[#F5F0E8]/40 hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"
                }`}>
                {c.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredPrestations.map(p => (
              <button
                key={p.id}
                onClick={() => { setPrestation(p); next(); }}
                className={`text-left p-4 rounded-xl border-2 transition-all group hover:border-[#C9A84C] hover:bg-[#C9A84C]/5 ${
                  prestation?.id === p.id ? "border-[#C9A84C] bg-[#C9A84C]/5" : "border-[#2A2A2A] bg-[#111111]"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-black text-[#F5F0E8] text-sm">{p.nom}</p>
                  {p.badge && (
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                      p.badge === "bestseller" ? "bg-[#C9A84C]/20 text-[#C9A84C]" :
                      p.badge === "populaire" ? "bg-[#8B2500]/30 text-[#FF6B35]" :
                      "bg-[#1A1A1A] text-[#F5F0E8]/40"
                    }`}>
                      {p.badge}
                    </span>
                  )}
                </div>
                <p className="text-[#F5F0E8]/40 text-xs mb-3 leading-relaxed">{p.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#C9A84C] font-black text-base">{formatFCFA(p.prix_fcfa)}</span>
                  <span className="text-[#F5F0E8]/25 text-xs">{p.duree_min} min</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 3 — Créneau ── */}
      {step === 3 && (
        <div>
          <button onClick={back} className="flex items-center gap-2 text-[#F5F0E8]/30 hover:text-[#C9A84C] text-sm mb-4 transition-colors">
            ‹ Retour
          </button>
          <h2 className="text-xl font-black text-[#F5F0E8] mb-1">Choisissez votre créneau</h2>
          <p className="text-[#F5F0E8]/40 text-sm mb-6">
            <span className="text-[#C9A84C]">{prestation?.nom}</span> · {prestation?.duree_min} min
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calendrier */}
            <div>
              <p className="text-xs text-[#F5F0E8]/40 uppercase tracking-widest mb-3">Choisir une date</p>
              <Calendrier selected={date} onSelect={setDate} />
            </div>

            {/* Créneaux horaires */}
            <div>
              <p className="text-xs text-[#F5F0E8]/40 uppercase tracking-widest mb-3">
                {date ? `Créneaux — ${formatDateFR(date)}` : "Sélectionnez d'abord une date"}
              </p>
              {!date ? (
                <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-8 flex items-center justify-center text-[#F5F0E8]/15 text-sm">
                  ← Choisissez une date
                </div>
              ) : loadingSlots ? (
                <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-8 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-4 grid grid-cols-3 gap-2 max-h-72 overflow-y-auto">
                  {slots.map(s => (
                    <button
                      key={s.heure}
                      disabled={!s.disponible}
                      onClick={() => setHeure(s.heure)}
                      className={`py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        heure === s.heure ? "bg-[#C9A84C] text-[#0A0A0A] font-black" :
                        !s.disponible ? "text-[#F5F0E8]/15 bg-[#1A1A1A] cursor-not-allowed line-through" :
                        "text-[#F5F0E8] bg-[#1A1A1A] hover:bg-[#C9A84C]/15 hover:text-[#C9A84C]"
                      }`}
                    >
                      {s.heure}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              disabled={!date || !heure}
              onClick={next}
              className="bg-[#C9A84C] text-[#0A0A0A] font-black px-8 py-3 rounded-xl disabled:opacity-30 hover:bg-[#E2C47A] transition-all disabled:cursor-not-allowed"
            >
              Continuer →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4 — Contact ── */}
      {step === 4 && (
        <div>
          <button onClick={back} className="flex items-center gap-2 text-[#F5F0E8]/30 hover:text-[#C9A84C] text-sm mb-4 transition-colors">
            ‹ Retour
          </button>
          <h2 className="text-xl font-black text-[#F5F0E8] mb-1">Vos coordonnées</h2>
          <p className="text-[#F5F0E8]/40 text-sm mb-6">Pour votre confirmation WhatsApp.</p>

          {/* Récap */}
          <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-4 mb-6 grid grid-cols-2 gap-2 text-sm">
            <span className="text-[#F5F0E8]/30">Salon</span>
            <span className="text-[#F5F0E8] font-semibold text-right">{salon}</span>
            <span className="text-[#F5F0E8]/30">Prestation</span>
            <span className="text-[#F5F0E8] font-semibold text-right">{prestation?.nom}</span>
            <span className="text-[#F5F0E8]/30">Date</span>
            <span className="text-[#F5F0E8] font-semibold text-right">{date ? formatDateFR(date) : ""}</span>
            <span className="text-[#F5F0E8]/30">Heure</span>
            <span className="text-[#C9A84C] font-black text-right">{heure}</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#F5F0E8]/40 uppercase tracking-widest mb-2">Nom complet *</label>
              <input
                type="text"
                value={clientNom}
                onChange={e => setClientNom(e.target.value)}
                placeholder="Ex : Kader Sawadogo"
                className="w-full bg-[#111111] border border-[#2A2A2A] text-[#F5F0E8] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/30 placeholder:text-[#F5F0E8]/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-[#F5F0E8]/40 uppercase tracking-widest mb-2">Téléphone (WhatsApp) *</label>
              <input
                type="tel"
                value={clientTel}
                onChange={e => setClientTel(e.target.value)}
                placeholder="Ex : +226 07 XX XX XX"
                className="w-full bg-[#111111] border border-[#2A2A2A] text-[#F5F0E8] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/30 placeholder:text-[#F5F0E8]/20 transition-all"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{error}</p>
          )}

          <button
            disabled={!clientNom.trim() || !clientTel.trim() || sending}
            onClick={handleConfirm}
            className="mt-6 w-full bg-[#C9A84C] text-[#0A0A0A] font-black py-4 rounded-xl disabled:opacity-30 hover:bg-[#E2C47A] transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {sending ? (
              <><div className="w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" /> Réservation en cours...</>
            ) : (
              "✓ Confirmer ma réservation"
            )}
          </button>

          <p className="text-center text-xs text-[#F5F0E8]/20 mt-3">
            Aucun paiement requis maintenant · Paiement sur place
          </p>
        </div>
      )}
    </div>
  );
}
