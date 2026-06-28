import { NextRequest } from "next/server";

// Catalogue serveur — les prix ne viennent jamais du client
const BOISSONS_CATALOGUE: Record<string, { nom: string; prix: number }> = {
  "eau-500": { nom: "Eau minérale 50cl", prix: 300 },
  "eau-1l": { nom: "Eau minérale 1L", prix: 500 },
  "jus-bissap": { nom: "Jus Bissap", prix: 600 },
  "jus-gingembre": { nom: "Jus Gingembre", prix: 600 },
  "jus-tamarin": { nom: "Jus Tamarin", prix: 600 },
  "coca": { nom: "Coca-Cola 33cl", prix: 700 },
  "fanta": { nom: "Fanta 33cl", prix: 700 },
  "sprite": { nom: "Sprite 33cl", prix: 700 },
  "cafe": { nom: "Café express", prix: 500 },
  "the": { nom: "Thé à la menthe", prix: 400 },
};

export async function POST(req: NextRequest) {
  const { items, mode_paiement, salon } = await req.json() as {
    items: { id: string; qte: number }[];
    mode_paiement: string;
    salon: string;
  };

  if (!Array.isArray(items) || items.length === 0) {
    return Response.json({ error: "Commande vide." }, { status: 400 });
  }
  if (!["ZAD", "SAABA"].includes(salon)) {
    return Response.json({ error: "Salon invalide." }, { status: 400 });
  }
  if (!["sur_place", "orange_money", "moov_money"].includes(mode_paiement)) {
    return Response.json({ error: "Mode de paiement invalide." }, { status: 400 });
  }

  // Reconstituer les items depuis le catalogue — ignore les prix envoyés par le client
  const resolvedItems = [];
  for (const item of items) {
    const produit = BOISSONS_CATALOGUE[item.id];
    if (!produit) return Response.json({ error: `Produit inconnu : ${item.id}` }, { status: 400 });
    const qte = Math.max(1, Math.min(10, Math.floor(Number(item.qte) || 1)));
    resolvedItems.push({ id: item.id, nom: produit.nom, prix: produit.prix, qte });
  }

  const id = `CMD-${Date.now().toString(36).toUpperCase()}`;
  const total = resolvedItems.reduce((acc, item) => acc + item.prix * item.qte, 0);

  return Response.json({
    success: true,
    commande: {
      id,
      items: resolvedItems,
      total,
      mode_paiement,
      salon,
      statut: mode_paiement === "sur_place" ? "en_attente_paiement" : "confirmee",
      created_at: new Date().toISOString(),
    },
  });
}
