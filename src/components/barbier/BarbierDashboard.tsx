"use client";
import { useState, useEffect, useCallback } from "react";
import { barbierDeconnexion } from "@/app/actions/barbier";
import { formatFCFA } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────
interface RDV {
  id: string; heure_debut: string; heure_fin: string; duree_min: number;
  prestation: string; prix_fcfa: number; client_nom: string;
  statut: "confirme" | "termine" | "noshow" | "en_cours";
}
interface CrenauBloque { id: string; heure_debut: string; heure_fin: string; raison: string; date: string; }
interface Stats { coupes_mois: number; revenu_genere: number; note_moy: number; no_shows: number; top_prestation: string; heure_pointe: string; }

const MOIS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const JOURS_SEMAINE = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];

function dateLabel(d: string) {
  const dt = new Date(d + "T12:00:00");
  return `${JOURS_SEMAINE[dt.getDay()]} ${dt.getDate()} ${MOIS[dt.getMonth()]}`;
}

function heureToMin(h: string) {
  const [hr, mn] = h.split(":").map(Number);
  return hr * 60 + mn;
}

// ── Pastille statut ──────────────────────────────────────────
const STATUT_STYLE: Record<string, string> = {
  confirme:  "bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/30",
  en_cours:  "bg-blue-500/10 text-blue-400 border-blue-500/30",
  termine:   "bg-green-500/10 text-green-400 border-green-500/30",
  noshow:    "bg-red-500/10 text-red-400 border-red-500/30",
};
const STATUT_LABEL: Record<string, string> = {
  confirme: "Confirmé", en_cours: "En cours", termine: "Terminé", noshow: "No-show",
};

// ── Agenda timeline ──────────────────────────────────────────
function AgendaTimeline({ rdvs, bloques, date, onNoShow }: {
  rdvs: RDV[]; bloques: CrenauBloque[]; date: string;
  onNoShow: (id: string) => void;
}) {
  const START = 9 * 60; const END = 21 * 60;
  const TOTAL = END - START;
  const PX_PER_MIN = 1.8;

  return (
    <div className="relative bg-[#0A0A0A] rounded-2xl border border-[#2A2A2A] overflow-hidden">
      {/* Lignes horaires */}
      <div className="relative" style={{ height: TOTAL * PX_PER_MIN }}>
        {Array.from({ length: 13 }, (_, i) => {
          const h = 9 + i;
          const y = i * 60 * PX_PER_MIN;
          return (
            <div key={h} className="absolute left-0 right-0 flex items-center" style={{ top: y }}>
              <span className="text-[10px] text-[#F5F0E8]/20 w-10 text-right pr-2 shrink-0">{h}h</span>
              <div className="flex-1 h-px bg-[#1A1A1A]" />
            </div>
          );
        })}

        {/* Heure actuelle */}
        {date === new Date().toISOString().split("T")[0] && (() => {
          const now = new Date();
          const nowMin = now.getHours() * 60 + now.getMinutes();
          if (nowMin < START || nowMin > END) return null;
          const y = (nowMin - START) * PX_PER_MIN;
          return (
            <div className="absolute left-10 right-0 flex items-center z-20 pointer-events-none" style={{ top: y }}>
              <div className="w-2 h-2 rounded-full bg-red-400 -ml-1 shrink-0" />
              <div className="flex-1 h-px bg-red-400/60" />
            </div>
          );
        })()}

        {/* Créneaux bloqués */}
        {bloques.map(b => {
          const top = (heureToMin(b.heure_debut) - START) * PX_PER_MIN;
          const h   = (heureToMin(b.heure_fin) - heureToMin(b.heure_debut)) * PX_PER_MIN;
          return (
            <div key={b.id} className="absolute left-12 right-2 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] flex items-center px-3 z-10"
              style={{ top, height: Math.max(h, 24) }}>
              <span className="text-[#F5F0E8]/25 text-xs">🚫 {b.raison}</span>
            </div>
          );
        })}

        {/* RDVs */}
        {rdvs.map(rdv => {
          const top = (heureToMin(rdv.heure_debut) - START) * PX_PER_MIN;
          const h   = rdv.duree_min * PX_PER_MIN;
          return (
            <div key={rdv.id}
              className={`absolute left-12 right-2 rounded-xl border p-3 z-10 ${
                rdv.statut === "noshow" ? "bg-red-500/5 border-red-500/20 opacity-50" :
                rdv.statut === "termine" ? "bg-green-500/5 border-green-500/20" :
                rdv.statut === "en_cours" ? "bg-blue-500/10 border-blue-500/30" :
                "bg-[#C9A84C]/5 border-[#C9A84C]/20"
              }`}
              style={{ top, height: Math.max(h, 52) }}>
              <div className="flex items-start justify-between gap-2 h-full">
                <div className="min-w-0">
                  <p className="text-[#F5F0E8] font-semibold text-xs truncate">{rdv.prestation}</p>
                  <p className="text-[#F5F0E8]/40 text-[10px]">{rdv.heure_debut} · {rdv.client_nom}</p>
                  {h > 40 && <p className="text-[#C9A84C] text-[10px] font-black mt-0.5">{formatFCFA(rdv.prix_fcfa)}</p>}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-semibold ${STATUT_STYLE[rdv.statut]}`}>
                    {STATUT_LABEL[rdv.statut]}
                  </span>
                  {rdv.statut === "confirme" && (
                    <button onClick={() => onNoShow(rdv.id)}
                      className="text-[9px] text-red-400/40 hover:text-red-400 transition-colors">
                      No-show
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Dashboard principal ──────────────────────────────────────
export default function BarbierDashboard({ barbierPrenom, salonNom }: { barbierPrenom: string; salonNom: string }) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate]       = useState(today);
  const [onglet, setOnglet]   = useState<"agenda" | "bloquer" | "stats">("agenda");
  const [rdvs, setRdvs]       = useState<RDV[]>([]);
  const [bloques, setBloques] = useState<CrenauBloque[]>([]);
  const [stats, setStats]     = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [nouvellesResas, setNouvellesResas] = useState(2); // simulation

  // Formulaire blocage
  const [blkForm, setBlkForm] = useState({ heure_debut: "12:00", heure_fin: "13:00", raison: "Pause déjeuner" });
  const [blkSending, setBlkSending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [rAgenda, rBloques, rStats] = await Promise.all([
      fetch(`/api/barbier/agenda?date=${date}`),
      fetch(`/api/barbier/creneaux-bloques?date=${date}`),
      fetch("/api/barbier/stats"),
    ]);
    const [dA, dB, dS] = await Promise.all([rAgenda.json(), rBloques.json(), rStats.json()]);
    setRdvs(dA.rdvs || []);
    setBloques(Array.isArray(dB) ? dB : []);
    setStats(dS);
    setLoading(false);
  }, [date]);

  useEffect(() => { load(); }, [load]);

  const handleNoShow = async (id: string) => {
    await fetch(`/api/barbier/reservations/${id}/noshow`, { method: "POST" });
    setRdvs(prev => prev.map(r => r.id === id ? { ...r, statut: "noshow" as const } : r));
  };

  const ajouterBlocage = async () => {
    setBlkSending(true);
    const res = await fetch("/api/barbier/creneaux-bloques", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, ...blkForm }),
    });
    const data = await res.json();
    if (data.success) setBloques(prev => [...prev, data.slot]);
    setBlkSending(false);
  };

  const supprimerBlocage = async (id: string) => {
    await fetch(`/api/barbier/creneaux-bloques?id=${id}&date=${date}`, { method: "DELETE" });
    setBloques(prev => prev.filter(b => b.id !== id));
  };

  const confirmes = rdvs.filter(r => r.statut === "confirme").length;
  const termines  = rdvs.filter(r => r.statut === "termine").length;
  const noshows   = rdvs.filter(r => r.statut === "noshow").length;
  const caJour    = rdvs.filter(r => r.statut === "termine").reduce((s, r) => s + r.prix_fcfa, 0);

  const inputCls = "w-full bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] rounded-xl px-3 py-2.5 text-sm focus:border-[#C9A84C] focus:outline-none transition-all";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 border-2 border-[#C9A84C]/40 flex items-center justify-center">
              <span className="text-[#C9A84C] font-black text-lg">✂️</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-[#F5F0E8]">{barbierPrenom}</h1>
              <p className="text-[#F5F0E8]/40 text-sm">Salon {salonNom}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Badge nouvelles réservations */}
          {nouvellesResas > 0 && (
            <button onClick={() => setNouvellesResas(0)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-lg text-xs text-[#C9A84C] font-semibold hover:bg-[#C9A84C]/20 transition-all">
              🔔 {nouvellesResas} nouveau{nouvellesResas > 1 ? "x" : ""}
            </button>
          )}
          <form action={barbierDeconnexion}>
            <button type="submit" className="text-[#F5F0E8]/20 text-xs px-3 py-2 border border-[#2A2A2A] rounded-lg hover:text-red-400 hover:border-red-400/20 transition-all">
              Quitter
            </button>
          </form>
        </div>
      </div>

      {/* KPI jour */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[
          { label: "À venir", value: confirmes, color: "text-[#C9A84C]" },
          { label: "Terminés", value: termines, color: "text-green-400" },
          { label: "No-shows", value: noshows,  color: "text-red-400" },
          { label: "CA jour", value: formatFCFA(caJour), color: "text-[#F5F0E8]" },
        ].map(k => (
          <div key={k.label} className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-3 text-center">
            <p className={`font-black text-sm ${k.color}`}>{k.value}</p>
            <p className="text-[10px] text-[#F5F0E8]/25 uppercase tracking-wider mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Sélecteur date */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => { const d = new Date(date); d.setDate(d.getDate()-1); setDate(d.toISOString().split("T")[0]); }}
          className="w-9 h-9 rounded-full bg-[#111111] border border-[#2A2A2A] flex items-center justify-center text-[#F5F0E8]/40 hover:text-[#C9A84C] hover:border-[#C9A84C]/30 transition-all text-lg">‹</button>
        <div className="flex-1 text-center">
          <p className="text-sm font-semibold text-[#F5F0E8]">{dateLabel(date)}</p>
          {date === today && <p className="text-[10px] text-[#C9A84C]">Aujourd&apos;hui</p>}
        </div>
        <button onClick={() => { const d = new Date(date); d.setDate(d.getDate()+1); setDate(d.toISOString().split("T")[0]); }}
          className="w-9 h-9 rounded-full bg-[#111111] border border-[#2A2A2A] flex items-center justify-center text-[#F5F0E8]/40 hover:text-[#C9A84C] hover:border-[#C9A84C]/30 transition-all text-lg">›</button>
        <button onClick={() => setDate(today)} className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${date === today ? "border-[#C9A84C]/40 text-[#C9A84C]" : "border-[#2A2A2A] text-[#F5F0E8]/25 hover:text-[#C9A84C]"}`}>
          Auj.
        </button>
      </div>

      {/* Onglets */}
      <div className="flex border-b border-[#2A2A2A] mb-5">
        {([["agenda","📅 Agenda"],["bloquer","🚫 Bloquer"],["stats","📊 Mes stats"]] as const).map(([t,l]) => (
          <button key={t} onClick={() => setOnglet(t)}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all ${onglet === t ? "border-[#C9A84C] text-[#C9A84C]" : "border-transparent text-[#F5F0E8]/30 hover:text-[#F5F0E8]/60"}`}>
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-7 h-7 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          {/* ── Agenda ── */}
          {onglet === "agenda" && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs text-[#F5F0E8]/40 uppercase tracking-widest">{rdvs.length} rendez-vous</p>
                <p className="text-xs text-[#F5F0E8]/20">⬤ rouge = maintenant</p>
              </div>
              <AgendaTimeline rdvs={rdvs} bloques={bloques} date={date} onNoShow={handleNoShow} />
            </div>
          )}

          {/* ── Bloquer créneaux ── */}
          {onglet === "bloquer" && (
            <div>
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5 mb-5">
                <p className="text-sm font-black text-[#F5F0E8] mb-4">Bloquer un créneau</p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[10px] text-[#F5F0E8]/30 uppercase tracking-widest mb-1.5">Début</label>
                    <input type="time" value={blkForm.heure_debut} onChange={e => setBlkForm(p => ({...p, heure_debut: e.target.value}))} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#F5F0E8]/30 uppercase tracking-widest mb-1.5">Fin</label>
                    <input type="time" value={blkForm.heure_fin} onChange={e => setBlkForm(p => ({...p, heure_fin: e.target.value}))} className={inputCls} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] text-[#F5F0E8]/30 uppercase tracking-widest mb-1.5">Raison</label>
                    <input type="text" value={blkForm.raison} onChange={e => setBlkForm(p => ({...p, raison: e.target.value}))} placeholder="Pause, Congé, RDV personnel..." className={inputCls} />
                  </div>
                </div>
                <button onClick={ajouterBlocage} disabled={blkSending}
                  className="w-full bg-[#C9A84C] text-[#0A0A0A] font-black py-2.5 rounded-xl text-sm disabled:opacity-40 hover:bg-[#E2C47A] transition-all">
                  {blkSending ? "..." : "🚫 Bloquer ce créneau"}
                </button>
              </div>

              {/* Liste créneaux bloqués */}
              {bloques.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-[#F5F0E8]/40 uppercase tracking-widest mb-3">Créneaux bloqués aujourd&apos;hui</p>
                  {bloques.map(b => (
                    <div key={b.id} className="bg-[#111111] border border-[#2A2A2A] rounded-xl px-4 py-3 flex justify-between items-center">
                      <div>
                        <p className="text-[#F5F0E8] text-sm font-semibold">{b.heure_debut} → {b.heure_fin}</p>
                        <p className="text-[#F5F0E8]/30 text-xs">{b.raison}</p>
                      </div>
                      <button onClick={() => supprimerBlocage(b.id)} className="text-[#F5F0E8]/20 hover:text-red-400 text-xl transition-colors">×</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[#F5F0E8]/20 text-sm py-8">Aucun créneau bloqué ce jour.</p>
              )}
            </div>
          )}

          {/* ── Stats personnelles ── */}
          {onglet === "stats" && stats && (
            <div>
              <div className="bg-gradient-to-br from-[#1A1000] to-[#0A0A0A] border border-[#C9A84C]/20 rounded-2xl p-6 mb-5">
                <p className="text-[10px] text-[#C9A84C]/60 tracking-[0.4em] uppercase mb-1">Performance du mois</p>
                <h3 className="text-xl font-black text-[#F5F0E8]">{barbierPrenom}</h3>
                <p className="text-[#F5F0E8]/30 text-xs">Salon {salonNom} · Ce mois</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: "Coupes",          value: stats.coupes_mois, icon: "✂️" },
                  { label: "CA généré",       value: formatFCFA(stats.revenu_genere), icon: "💰" },
                  { label: "Note moyenne",    value: `${stats.note_moy} / 5 ★`, icon: "⭐" },
                  { label: "No-shows",        value: stats.no_shows, icon: "🚫" },
                ].map(s => (
                  <div key={s.label} className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-4">
                    <div className="text-2xl mb-2">{s.icon}</div>
                    <p className="text-[#C9A84C] font-black text-base">{s.value}</p>
                    <p className="text-[10px] text-[#F5F0E8]/30 uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-5 space-y-3">
                {[
                  ["Top prestation", stats.top_prestation],
                  ["Heure de pointe", stats.heure_pointe],
                  ["Taux no-show", `${((stats.no_shows / Math.max(stats.coupes_mois,1)) * 100).toFixed(1)}%`],
                  ["Moy. par coupe", formatFCFA(Math.round(stats.revenu_genere / Math.max(stats.coupes_mois,1)))],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-[#F5F0E8]/40">{label}</span>
                    <span className="text-[#F5F0E8] font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
