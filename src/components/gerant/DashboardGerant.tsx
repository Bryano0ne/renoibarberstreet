"use client";
import { useState, useEffect, useCallback } from "react";
import { formatFCFA } from "@/lib/utils";
import { gerantDeconnexion } from "@/app/actions/gerant";

// ─── Types ───────────────────────────────────────────────────
interface JourRevenu { date: string; zad: number; saaba: number; coupes_zad: number; coupes_saaba: number; }
interface Depense { id: string; date: string; salon: string; categorie: string; description: string; montant: number; }
interface Rapport {
  periode: string; type: string;
  salons: { ZAD: SalonStats; SAABA: SalonStats };
  totaux: { coupes: number; revenus: number; depenses: number; benefice: number; marge_pct: number };
  prestations_top: { nom: string; coupes: number; revenus: number }[];
}
interface SalonStats { coupes: number; revenus: number; top_prestation: string; top_prestation_count: number; barbier_top: string; barbier_coupes: number; heure_pointe: string; jour_pointe: string; }

const CATEGORIES = ["Produits", "Salaires", "Loyer", "Électricité", "Matériel", "Autre"];
const MOIS_COURT = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

function dateShort(d: string) {
  const [,m,day] = d.split("-");
  return `${Number(day)} ${MOIS_COURT[Number(m)-1]}`;
}

// ─── Graphique SVG ────────────────────────────────────────────
function BarChart({ jours, salonFilter }: { jours: JourRevenu[]; salonFilter: string }) {
  const H = 160; const PAD = 8;
  const last14 = jours.slice(-14);

  const vals = last14.map(j =>
    salonFilter === "ZAD" ? j.zad : salonFilter === "SAABA" ? j.saaba : j.zad + j.saaba
  );
  const max = Math.max(...vals, 1);
  const W_bar = 100 / last14.length;

  return (
    <svg viewBox={`0 0 100 ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 180 }}>
      {/* Grilles */}
      {[0.25, 0.5, 0.75, 1].map(r => (
        <line key={r} x1={0} y1={H - H * r} x2={100} y2={H - H * r}
          stroke="#2A2A2A" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      ))}
      {/* Barres */}
      {last14.map((j, i) => {
        const v = vals[i];
        const h = (v / max) * (H - PAD);
        const x = i * W_bar + W_bar * 0.1;
        const w = W_bar * 0.8;
        const isWeekend = new Date(j.date).getDay() === 0 || new Date(j.date).getDay() === 6;
        return (
          <g key={j.date}>
            <rect x={x} y={H - h} width={w} height={h}
              fill={isWeekend ? "#C9A84C" : "#C9A84C66"} rx="1" />
          </g>
        );
      })}
    </svg>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────
function KpiCard({ label, value, sub, icon, color }: { label: string; value: string; sub?: string; icon: string; color: string }) {
  return (
    <div className={`bg-[#111111] border rounded-xl p-4 ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#F5F0E8]/40 uppercase tracking-widest">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-xl font-black text-[#F5F0E8] mb-0.5">{value}</p>
      {sub && <p className="text-xs text-[#F5F0E8]/30">{sub}</p>}
    </div>
  );
}

// ─── Dashboard principal ──────────────────────────────────────
export default function DashboardGerant() {
  const [salonFilter, setSalonFilter] = useState("tous");
  const [periode, setPeriode] = useState("mois");
  const [jours, setJours] = useState<JourRevenu[]>([]);
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [rapport, setRapport] = useState<Rapport | null>(null);
  const [loading, setLoading] = useState(true);
  const [onglet, setOnglet] = useState<"revenus" | "depenses" | "rapport">("revenus");

  // Formulaire dépense
  const [depForm, setDepForm] = useState({ salon: "ZAD", categorie: "Produits", description: "", montant: "", date: "" });
  const [depSending, setDepSending] = useState(false);

  // Rapport type
  const [rapportType, setRapportType] = useState<"semaine" | "mois">("semaine");

  const load = useCallback(async () => {
    setLoading(true);
    const [rRev, rDep, rRap] = await Promise.all([
      fetch(`/api/gerant/revenus?periode=${periode}&salon=${salonFilter}`),
      fetch("/api/gerant/depenses"),
      fetch(`/api/gerant/rapport?type=${rapportType}`),
    ]);
    const [dRev, dDep, dRap] = await Promise.all([rRev.json(), rDep.json(), rRap.json()]);
    setJours(dRev.jours || []);
    setDepenses(dDep);
    setRapport(dRap);
    setLoading(false);
  }, [periode, salonFilter, rapportType]);

  useEffect(() => { load(); }, [load]);

  // Calculs KPI
  const revenusBruts = jours.reduce((s, j) => {
    if (salonFilter === "ZAD") return s + j.zad;
    if (salonFilter === "SAABA") return s + j.saaba;
    return s + j.zad + j.saaba;
  }, 0);
  const totalDepenses = depenses.reduce((s, d) =>
    salonFilter === "tous" || d.salon === salonFilter ? s + d.montant : s, 0);
  const benefice = revenusBruts - totalDepenses;
  const totalCoupes = jours.reduce((s, j) => {
    if (salonFilter === "ZAD") return s + j.coupes_zad;
    if (salonFilter === "SAABA") return s + j.coupes_saaba;
    return s + j.coupes_zad + j.coupes_saaba;
  }, 0);

  // Ajout dépense
  const ajouterDepense = async () => {
    if (!depForm.description || !depForm.montant) return;
    setDepSending(true);
    await fetch("/api/gerant/depenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(depForm),
    });
    setDepForm({ salon: "ZAD", categorie: "Produits", description: "", montant: "", date: "" });
    await load();
    setDepSending(false);
  };

  const supprimerDepense = async (id: string) => {
    await fetch(`/api/gerant/depenses?id=${id}`, { method: "DELETE" });
    setDepenses(prev => prev.filter(d => d.id !== id));
  };

  // Export CSV
  const exportCSV = () => {
    const rows = [
      ["Date", "Salon", "ZAD Revenus", "SAABA Revenus", "Total", "Coupes ZAD", "Coupes SAABA"],
      ...jours.map(j => [j.date, "", j.zad, j.saaba, j.zad + j.saaba, j.coupes_zad, j.coupes_saaba]),
    ];
    const csv = rows.map(r => r.join(";")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = `renoi-revenus-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const exportPDF = () => window.print();

  const inputCls = "w-full bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] rounded-xl px-3 py-2.5 text-sm focus:border-[#C9A84C] focus:outline-none transition-all placeholder:text-[#F5F0E8]/20";
  const selectCls = `${inputCls} cursor-pointer`;

  return (
    <>
      <style>{`@media print { .no-print { display: none !important; } }`}</style>

      {/* Header */}
      <div className="no-print flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-[#F5F0E8]">Dashboard Gérant</h1>
          <p className="text-[#F5F0E8]/40 text-sm">RENOI Barberstreet · Vue d&apos;ensemble</p>
        </div>
        <div className="flex items-center gap-2">
          <form action={gerantDeconnexion}>
            <button type="submit" className="text-[#F5F0E8]/25 text-xs hover:text-red-400 transition-colors px-3 py-2 border border-[#2A2A2A] rounded-lg">
              Déconnexion
            </button>
          </form>
        </div>
      </div>

      {/* Filtres */}
      <div className="no-print flex flex-wrap gap-3 mb-6">
        {/* Salon */}
        <div className="flex rounded-xl border border-[#2A2A2A] overflow-hidden">
          {["tous","ZAD","SAABA"].map(s => (
            <button key={s} onClick={() => setSalonFilter(s)}
              className={`px-4 py-2 text-xs font-semibold transition-all ${salonFilter === s ? "bg-[#C9A84C] text-[#0A0A0A]" : "text-[#F5F0E8]/40 hover:text-[#C9A84C]"}`}>
              {s === "tous" ? "Les 2 salons" : `Salon ${s}`}
            </button>
          ))}
        </div>
        {/* Période */}
        <div className="flex rounded-xl border border-[#2A2A2A] overflow-hidden">
          {[["7j","semaine"],["30j","mois"],["1an","an"]].map(([label, val]) => (
            <button key={val} onClick={() => setPeriode(val)}
              className={`px-4 py-2 text-xs font-semibold transition-all ${periode === val ? "bg-[#C9A84C] text-[#0A0A0A]" : "text-[#F5F0E8]/40 hover:text-[#C9A84C]"}`}>
              {label}
            </button>
          ))}
        </div>
        {/* Exports */}
        <button onClick={exportCSV} className="no-print px-4 py-2 text-xs font-semibold border border-[#2A2A2A] text-[#F5F0E8]/40 rounded-xl hover:border-[#C9A84C]/40 hover:text-[#C9A84C] transition-all">
          ⬇ CSV
        </button>
        <button onClick={exportPDF} className="no-print px-4 py-2 text-xs font-semibold border border-[#2A2A2A] text-[#F5F0E8]/40 rounded-xl hover:border-[#C9A84C]/40 hover:text-[#C9A84C] transition-all">
          🖨 PDF
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          {/* KPI */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <KpiCard label="Revenus" value={formatFCFA(revenusBruts)} sub="30 derniers jours" icon="💰" color="border-[#C9A84C]/20" />
            <KpiCard label="Dépenses" value={formatFCFA(totalDepenses)} sub="ce mois" icon="📦" color="border-red-500/20" />
            <KpiCard label="Bénéfice net" value={formatFCFA(benefice)} sub={`Marge ${Math.round((benefice/Math.max(revenusBruts,1))*100)}%`} icon="📈" color="border-green-500/20" />
            <KpiCard label="Coupes" value={totalCoupes.toString()} sub="30 derniers jours" icon="✂️" color="border-[#2A2A2A]" />
          </div>

          {/* Onglets */}
          <div className="no-print flex border-b border-[#2A2A2A] mb-6">
            {(["revenus","depenses","rapport"] as const).map(t => (
              <button key={t} onClick={() => setOnglet(t)}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all capitalize ${onglet === t ? "border-[#C9A84C] text-[#C9A84C]" : "border-transparent text-[#F5F0E8]/30 hover:text-[#F5F0E8]/60"}`}>
                {t === "revenus" ? "📊 Revenus" : t === "depenses" ? "📦 Dépenses" : "📋 Haircut Replay"}
              </button>
            ))}
          </div>

          {/* ── Onglet Revenus ── */}
          {onglet === "revenus" && (
            <div>
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-[#F5F0E8]">Revenus journaliers (14 derniers jours)</p>
                  <p className="text-[10px] text-[#F5F0E8]/20 uppercase tracking-wider">Or = weekend</p>
                </div>
                <BarChart jours={jours} salonFilter={salonFilter} />
                {/* Étiquettes axe X simplifiées */}
                <div className="flex justify-between mt-2">
                  {jours.slice(-14).filter((_, i) => i % 3 === 0).map(j => (
                    <span key={j.date} className="text-[9px] text-[#F5F0E8]/20">{dateShort(j.date)}</span>
                  ))}
                </div>
              </div>

              {/* Détail par salon */}
              {salonFilter === "tous" && (
                <div className="grid grid-cols-2 gap-3">
                  {(["ZAD","SAABA"] as const).map(s => {
                    const rev = jours.reduce((acc, j) => acc + (s === "ZAD" ? j.zad : j.saaba), 0);
                    const coupes = jours.reduce((acc, j) => acc + (s === "ZAD" ? j.coupes_zad : j.coupes_saaba), 0);
                    return (
                      <div key={s} className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-4">
                        <p className="text-xs text-[#F5F0E8]/40 uppercase tracking-widest mb-2">Salon {s}</p>
                        <p className="text-lg font-black text-[#C9A84C]">{formatFCFA(rev)}</p>
                        <p className="text-xs text-[#F5F0E8]/30 mt-0.5">{coupes} coupes · moy {formatFCFA(Math.round(rev/Math.max(coupes,1)))}/coupe</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Onglet Dépenses ── */}
          {onglet === "depenses" && (
            <div>
              {/* Formulaire ajout */}
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5 mb-5">
                <p className="text-sm font-black text-[#F5F0E8] mb-4">➕ Ajouter une dépense</p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <select value={depForm.salon} onChange={e => setDepForm(p => ({...p, salon: e.target.value}))} className={selectCls}>
                    <option value="ZAD">Salon ZAD</option>
                    <option value="SAABA">Salon SAABA</option>
                  </select>
                  <select value={depForm.categorie} onChange={e => setDepForm(p => ({...p, categorie: e.target.value}))} className={selectCls}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input type="text" placeholder="Description" value={depForm.description} onChange={e => setDepForm(p => ({...p, description: e.target.value}))} className={`${inputCls} col-span-2`} />
                  <input type="number" placeholder="Montant (FCFA)" value={depForm.montant} onChange={e => setDepForm(p => ({...p, montant: e.target.value}))} className={inputCls} />
                  <input type="date" value={depForm.date} onChange={e => setDepForm(p => ({...p, date: e.target.value}))} className={inputCls} />
                </div>
                <button onClick={ajouterDepense} disabled={depSending || !depForm.description || !depForm.montant}
                  className="w-full bg-[#C9A84C] text-[#0A0A0A] font-black py-2.5 rounded-xl text-sm disabled:opacity-30 hover:bg-[#E2C47A] transition-all">
                  {depSending ? "..." : "Enregistrer la dépense"}
                </button>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-4 px-1">
                <p className="text-xs text-[#F5F0E8]/40 uppercase tracking-widest">Historique</p>
                <p className="text-sm font-black text-red-400">{formatFCFA(depenses.filter(d => salonFilter === "tous" || d.salon === salonFilter).reduce((s, d) => s + d.montant, 0))}</p>
              </div>

              {/* Liste */}
              <div className="space-y-2">
                {depenses.filter(d => salonFilter === "tous" || d.salon === salonFilter).map(d => (
                  <div key={d.id} className="bg-[#111111] border border-[#2A2A2A] rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[#F5F0E8] text-sm font-semibold truncate">{d.description}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2A2A2A] text-[#F5F0E8]/40 shrink-0">{d.categorie}</span>
                      </div>
                      <p className="text-[#F5F0E8]/30 text-xs">{d.date} · Salon {d.salon}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-red-400 font-black text-sm">- {formatFCFA(d.montant)}</span>
                      <button onClick={() => supprimerDepense(d.id)} className="text-[#F5F0E8]/15 hover:text-red-400 text-lg transition-colors">×</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Onglet Rapport Haircut Replay ── */}
          {onglet === "rapport" && rapport && (
            <div>
              {/* Toggle */}
              <div className="no-print flex gap-2 mb-6">
                {(["semaine","mois"] as const).map(t => (
                  <button key={t} onClick={() => setRapportType(t)}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold border transition-all ${rapportType === t ? "bg-[#C9A84C] text-[#0A0A0A] border-[#C9A84C]" : "border-[#2A2A2A] text-[#F5F0E8]/40 hover:border-[#C9A84C]/40"}`}>
                    {t === "semaine" ? "Cette semaine" : "Ce mois"}
                  </button>
                ))}
              </div>

              {/* Header rapport */}
              <div className="bg-gradient-to-br from-[#1A1000] to-[#0A0A0A] border border-[#C9A84C]/20 rounded-2xl p-6 mb-5">
                <p className="text-[10px] text-[#C9A84C]/60 tracking-[0.4em] uppercase mb-1">✂️ Haircut Replay</p>
                <h3 className="text-xl font-black text-[#F5F0E8] mb-0.5">{rapport.periode}</h3>
                <p className="text-[#F5F0E8]/30 text-xs">Rapport généré automatiquement · RENOI Barberstreet</p>
              </div>

              {/* Totaux */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <KpiCard label="Coupes total" value={rapport.totaux.coupes.toString()} icon="✂️" color="border-[#2A2A2A]" />
                <KpiCard label="Revenus" value={formatFCFA(rapport.totaux.revenus)} icon="💰" color="border-[#C9A84C]/20" />
                <KpiCard label="Dépenses" value={formatFCFA(rapport.totaux.depenses)} icon="📦" color="border-red-500/20" />
                <KpiCard label="Bénéfice" value={formatFCFA(rapport.totaux.benefice)} sub={`Marge ${rapport.totaux.marge_pct}%`} icon="📈" color="border-green-500/20" />
              </div>

              {/* Par salon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {(["ZAD","SAABA"] as const).map(s => {
                  const st = rapport.salons[s];
                  return (
                    <div key={s} className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-5">
                      <p className="text-xs text-[#C9A84C] uppercase tracking-widest mb-3 font-black">Salon {s}</p>
                      <div className="space-y-2 text-sm">
                        {[
                          ["Coupes", st.coupes],
                          ["Revenus", formatFCFA(st.revenus)],
                          ["Top prestation", `${st.top_prestation} (×${st.top_prestation_count})`],
                          ["Meilleur barbier", `${st.barbier_top} · ${st.barbier_coupes} coupes`],
                          ["Heure de pointe", st.heure_pointe],
                          ["Jour le + chargé", st.jour_pointe],
                        ].map(([label, val]) => (
                          <div key={label as string} className="flex justify-between">
                            <span className="text-[#F5F0E8]/40">{label as string}</span>
                            <span className="text-[#F5F0E8] font-semibold text-right">{val as string}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Top prestations */}
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-5">
                <p className="text-xs text-[#F5F0E8] font-black uppercase tracking-widest mb-4">Top prestations</p>
                <div className="space-y-3">
                  {rapport.prestations_top.map((p, i) => {
                    const maxRev = rapport.prestations_top[0].revenus;
                    const pct = (p.revenus / maxRev) * 100;
                    return (
                      <div key={p.nom}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#F5F0E8]">{i + 1}. {p.nom}</span>
                          <span className="text-[#C9A84C] font-black">{formatFCFA(p.revenus)} <span className="text-[#F5F0E8]/30">({p.coupes} coupes)</span></span>
                        </div>
                        <div className="h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
                          <div className="h-full bg-[#C9A84C] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
