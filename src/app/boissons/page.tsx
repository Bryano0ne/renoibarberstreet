"use client";
import { useState } from "react";
import Link from "next/link";
import { formatFCFA } from "@/lib/utils";

interface Boisson {
  id: string;
  nom: string;
  description: string;
  prix: number;
  emoji: string;
  categorie: string;
  couleur: string;
}

const BOISSONS: Boisson[] = [
  {
    id: "dafani",
    nom: "Dafani",
    description: "Jus de fruits local — mangue, bissap ou gingembre",
    prix: 300,
    emoji: "🧃",
    categorie: "Jus",
    couleur: "#E8A020",
  },
  {
    id: "fanta",
    nom: "Fanta",
    description: "Soda à l'orange, pétillant et rafraîchissant",
    prix: 500,
    emoji: "🍊",
    categorie: "Soda",
    couleur: "#FF6B00",
  },
  {
    id: "coca",
    nom: "Coca-Cola",
    description: "Le classique intemporel, bien frais",
    prix: 500,
    emoji: "🥤",
    categorie: "Soda",
    couleur: "#CC2200",
  },
  {
    id: "sprite",
    nom: "Sprite",
    description: "Citron-citron vert, idéal pour désaltérer",
    prix: 500,
    emoji: "💚",
    categorie: "Soda",
    couleur: "#22AA44",
  },
  {
    id: "lafi",
    nom: "Eau Lafi",
    description: "Eau minérale pure et fraîche",
    prix: 200,
    emoji: "💧",
    categorie: "Eau",
    couleur: "#0088CC",
  },
];

const MODES_PAIEMENT = [
  { id: "orange_money", label: "Orange Money", emoji: "🟠" },
  { id: "moov_money", label: "Moov Money", emoji: "🔵" },
  { id: "sur_place", label: "Payer en caisse", emoji: "🏪" },
];

type CartState = Record<string, number>;

interface CommandeResult {
  id: string;
  total: number;
}

export default function BoissonsPage() {
  const [cart, setCart] = useState<CartState>({});
  const [showModal, setShowModal] = useState(false);
  const [modePaiement, setModePaiement] = useState("sur_place");
  const [salon, setSalon] = useState<"ZAD" | "SAABA">("ZAD");
  const [loading, setLoading] = useState(false);
  const [commande, setCommande] = useState<CommandeResult | null>(null);

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrix = BOISSONS.reduce((acc, b) => acc + (cart[b.id] || 0) * b.prix, 0);

  const addToCart = (id: string) =>
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));

  const removeFromCart = (id: string) =>
    setCart((c) => {
      const n = (c[id] || 0) - 1;
      if (n <= 0) {
        const { [id]: _removed, ...rest } = c;
        return rest;
      }
      return { ...c, [id]: n };
    });

  const handleCommande = async () => {
    setLoading(true);
    const items = BOISSONS.filter((b) => cart[b.id]).map((b) => ({
      id: b.id,
      nom: b.nom,
      prix: b.prix,
      qte: cart[b.id],
    }));

    const res = await fetch("/api/commande", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, mode_paiement: modePaiement, salon }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setCommande({ id: data.commande.id, total: data.commande.total });
      setShowModal(false);
      setCart({});
    }
  };

  if (commande) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 pt-20 pb-16">
        <div className="max-w-sm w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-2xl font-black text-[#F5F0E8] mb-2">Commande confirmée !</h1>
          <p className="text-[#F5F0E8]/40 text-sm mb-8">
            Ta boisson sera servie sous peu. Profites-en !
          </p>

          <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5 text-left mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-[#F5F0E8]/40 text-sm">Référence</span>
              <span className="text-[#C9A84C] font-black font-mono text-sm">{commande.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#F5F0E8]/40 text-sm">Salon</span>
              <span className="text-[#F5F0E8] text-sm">RENOI {salon}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#F5F0E8]/40 text-sm">Total</span>
              <span className="text-[#C9A84C] font-black">{formatFCFA(commande.total)}</span>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-[#1A1000] to-[#0A0A0A] border border-[#C9A84C]/40 rounded-2xl px-6 py-4 mb-6 text-left">
            <p className="text-[10px] text-[#C9A84C]/60 tracking-[0.35em] uppercase mb-2">
              ✦ RENOI Barberstreet ✦
            </p>
            <p className="text-[#F5F0E8] text-sm leading-relaxed">
              Merci pour ta commande. Profite de ta boisson en attendant ton tour !
            </p>
            <p className="text-[#C9A84C] font-black text-sm mt-2">
              Minimum 03 baby, always !
            </p>
          </div>

          <button
            onClick={() => setCommande(null)}
            className="w-full bg-[#C9A84C] text-[#0A0A0A] font-black py-3 rounded-xl hover:bg-[#E2C47A] transition-all mb-3"
          >
            Commander autre chose
          </button>
          <Link
            href="/"
            className="block text-[#F5F0E8]/25 text-sm py-2 hover:text-[#F5F0E8]/50 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen pt-20 pb-32 px-4">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">
              En salon · Servi à ta place
            </p>
            <h1 className="text-4xl font-black text-[#F5F0E8] mb-2">
              Boissons &amp; <span className="text-[#C9A84C]">Rafraîchissements</span>
            </h1>
            <p className="text-[#F5F0E8]/40 text-sm">
              Commande pendant ton attente — livré directement à ta place.
            </p>
          </div>

          {/* Sélecteur de salon */}
          <div className="flex gap-2 mb-8">
            {(["ZAD", "SAABA"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSalon(s)}
                className={`flex-1 py-2.5 text-sm font-black rounded-xl transition-all ${
                  salon === s
                    ? "bg-[#C9A84C] text-[#0A0A0A]"
                    : "border border-[#2A2A2A] text-[#F5F0E8]/40 hover:border-[#C9A84C]/40 hover:text-[#F5F0E8]/70"
                }`}
              >
                RENOI {s}
              </button>
            ))}
          </div>

          {/* Liste des boissons */}
          <div className="space-y-3">
            {BOISSONS.map((b) => (
              <div
                key={b.id}
                className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-4 flex items-center gap-4 hover:border-[#C9A84C]/20 transition-all"
              >
                {/* Emoji */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
                  style={{
                    background: `${b.couleur}15`,
                    border: `1px solid ${b.couleur}30`,
                  }}
                >
                  {b.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-black text-[#F5F0E8] text-base">{b.nom}</h3>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold shrink-0"
                      style={{ color: b.couleur, background: `${b.couleur}18` }}
                    >
                      {b.categorie}
                    </span>
                  </div>
                  <p className="text-[#F5F0E8]/40 text-xs leading-relaxed line-clamp-1">
                    {b.description}
                  </p>
                  <p className="text-[#C9A84C] font-black text-sm mt-1">{formatFCFA(b.prix)}</p>
                </div>

                {/* Contrôle quantité */}
                <div className="flex items-center gap-2 shrink-0">
                  {cart[b.id] ? (
                    <>
                      <button
                        onClick={() => removeFromCart(b.id)}
                        className="w-8 h-8 rounded-full border border-[#3A3A3A] text-[#F5F0E8]/50 hover:border-[#C9A84C]/40 hover:text-[#C9A84C] transition-all flex items-center justify-center text-lg leading-none"
                      >
                        −
                      </button>
                      <span className="text-[#F5F0E8] font-black text-base w-5 text-center">
                        {cart[b.id]}
                      </span>
                    </>
                  ) : null}
                  <button
                    onClick={() => addToCart(b.id)}
                    className="w-8 h-8 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all flex items-center justify-center text-lg leading-none font-black"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Barre panier fixée en bas */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0A0A0A]/95 backdrop-blur-md border-t border-[#2A2A2A] z-40">
          <div className="max-w-xl mx-auto">
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-[#C9A84C] text-[#0A0A0A] font-black py-4 rounded-2xl hover:bg-[#E2C47A] transition-all flex items-center justify-between px-6"
            >
              <span className="bg-[#0A0A0A]/20 text-[#0A0A0A] text-sm font-black w-6 h-6 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
              <span className="text-base">Commander</span>
              <span className="font-black">{formatFCFA(totalPrix)}</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal confirmation & paiement */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-black text-[#F5F0E8] mb-0.5">
                Confirmer la commande
              </h2>
              <p className="text-[#F5F0E8]/40 text-sm mb-6">Salon RENOI {salon}</p>

              {/* Récapitulatif */}
              <div className="bg-[#0A0A0A] rounded-xl p-4 mb-5 space-y-2">
                {BOISSONS.filter((b) => cart[b.id]).map((b) => (
                  <div key={b.id} className="flex justify-between text-sm">
                    <span className="text-[#F5F0E8]/60">
                      {b.emoji} {b.nom} ×{cart[b.id]}
                    </span>
                    <span className="text-[#F5F0E8] font-semibold">
                      {formatFCFA(b.prix * cart[b.id])}
                    </span>
                  </div>
                ))}
                <div className="border-t border-[#2A2A2A] pt-2 flex justify-between font-black">
                  <span className="text-[#F5F0E8]">Total</span>
                  <span className="text-[#C9A84C]">{formatFCFA(totalPrix)}</span>
                </div>
              </div>

              {/* Mode paiement */}
              <p className="text-[10px] text-[#F5F0E8]/30 tracking-widest uppercase mb-3">
                Mode de paiement
              </p>
              <div className="space-y-2 mb-6">
                {MODES_PAIEMENT.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setModePaiement(m.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      modePaiement === m.id
                        ? "border-[#C9A84C] bg-[#C9A84C]/5"
                        : "border-[#2A2A2A] hover:border-[#3A3A3A]"
                    }`}
                  >
                    <span className="text-xl">{m.emoji}</span>
                    <span
                      className={`font-semibold text-sm ${
                        modePaiement === m.id
                          ? "text-[#C9A84C]"
                          : "text-[#F5F0E8]/60"
                      }`}
                    >
                      {m.label}
                    </span>
                    {modePaiement === m.id && (
                      <span className="ml-auto text-[#C9A84C] text-xs font-black">✓</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-[#2A2A2A] text-[#F5F0E8]/40 rounded-xl text-sm hover:border-[#3A3A3A] transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCommande}
                  disabled={loading}
                  className="flex-[2] py-3 bg-[#C9A84C] text-[#0A0A0A] font-black rounded-xl text-sm hover:bg-[#E2C47A] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Envoi..." : "Confirmer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
