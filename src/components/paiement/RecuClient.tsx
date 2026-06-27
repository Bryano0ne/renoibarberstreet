"use client";
import Image from "next/image";
import { formatFCFA } from "@/lib/utils";

const MOIS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

function dateFR(d: string) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${Number(day)} ${MOIS[Number(m) - 1]} ${y}`;
}

interface Props {
  id: string;
  montant: number;
  prestation: string;
  salon: string;
  mode: string;
  date: string;
  heure: string;
  barbier: string;
}

export default function RecuClient({ id, montant, prestation, salon, mode, date, heure, barbier }: Props) {
  const now = new Date();
  const emis = `${dateFR(now.toISOString().split("T")[0])} à ${now.getHours()}h${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    <>
      {/* Styles print */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .recu-card { box-shadow: none !important; border: 1px solid #ccc !important; background: white !important; color: black !important; }
          .recu-gold { color: #8B6914 !important; }
        }
      `}</style>

      <main className="min-h-screen pt-20 pb-16 px-4 flex flex-col items-center">
        {/* Bouton print */}
        <div className="no-print w-full max-w-md mb-6 flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 border border-[#C9A84C]/40 text-[#C9A84C] py-3 rounded-xl text-sm font-semibold hover:bg-[#C9A84C]/10 transition-all"
          >
            🖨️ Imprimer / Sauvegarder PDF
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-4 border border-[#2A2A2A] text-[#F5F0E8]/40 rounded-xl text-sm hover:border-[#3A3A3A] transition-all"
          >
            ← Retour
          </button>
        </div>

        {/* Reçu */}
        <div className="recu-card w-full max-w-md bg-[#111111] border border-[#2A2A2A] rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#1A1000] to-[#0A0A0A] p-6 text-center border-b border-[#2A2A2A]">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#C9A84C]/40 mx-auto mb-3">
              <Image src="/images/logo.jpg" alt="RENOI Barberstreet" fill sizes="56px" className="object-cover" />
            </div>
            <h1 className="recu-gold text-[#C9A84C] font-black text-lg tracking-widest uppercase">RENOI BARBERSTREET</h1>
            <p className="text-[#F5F0E8]/40 text-xs tracking-widest mt-0.5">La valeur sûre · Ouagadougou</p>
          </div>

          <div className="p-6">
            {/* Titre */}
            <div className="text-center mb-6">
              <p className="recu-gold text-[#C9A84C] text-xs tracking-[0.4em] uppercase">REÇU DE PAIEMENT</p>
              <p className="text-[#F5F0E8]/30 text-xs mt-1">Émis le {emis}</p>
            </div>

            {/* Lignes */}
            <div className="space-y-3 text-sm">
              {[
                { label: "Référence", value: id, mono: true, gold: true },
                { label: "Prestation", value: prestation },
                { label: "Salon", value: `RENOI ${salon}` },
                date && { label: "Date RDV", value: `${dateFR(date)}${heure ? ` à ${heure}` : ""}` },
                barbier && { label: "Barbier", value: barbier },
                { label: "Mode paiement", value: mode === "sur_place" ? "Paiement sur place" : mode === "orange_money" ? "Orange Money" : mode === "moov_money" ? "Moov Money" : mode === "wave" ? "Wave" : "En ligne" },
                { label: "Statut", value: mode === "sur_place" ? "À régler sur place" : "Payé ✓", green: true },
              ].filter(Boolean).map((row, i) => {
                const r = row as { label: string; value: string; mono?: boolean; gold?: boolean; green?: boolean };
                return (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-[#1A1A1A] last:border-0">
                    <span className="text-[#F5F0E8]/40">{r.label}</span>
                    <span className={`font-semibold text-right ${r.gold ? "recu-gold text-[#C9A84C] font-mono" : r.green ? "text-green-400" : "text-[#F5F0E8]"}`}>
                      {r.value}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Montant total */}
            {montant > 0 && (
              <div className="mt-5 bg-[#0A0A0A] rounded-xl p-4 flex justify-between items-center border border-[#2A2A2A]">
                <span className="text-[#F5F0E8] font-black">TOTAL</span>
                <span className="recu-gold text-[#C9A84C] font-black text-2xl">{formatFCFA(montant)}</span>
              </div>
            )}

            {/* Footer reçu */}
            <div className="mt-6 pt-4 border-t border-[#2A2A2A] text-center space-y-1">
              <p className="text-[#F5F0E8]/20 text-[10px]">Merci de votre confiance !</p>
              <p className="text-[#F5F0E8]/15 text-[10px]">ZAD : +226 67 91 22 22 · SAABA : +226 07 95 24 34</p>
              <p className="text-[#F5F0E8]/10 text-[10px]">@renoi_barberstreet · 7j/7 · 9h–21h</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
