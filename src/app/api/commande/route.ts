import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { items, mode_paiement, salon } = await req.json() as {
    items: { id: string; nom: string; prix: number; qte: number }[];
    mode_paiement: string;
    salon: string;
  };

  const id = `CMD-${Date.now().toString(36).toUpperCase()}`;
  const total = items.reduce((acc, item) => acc + item.prix * item.qte, 0);

  return Response.json({
    success: true,
    commande: {
      id,
      items,
      total,
      mode_paiement,
      salon,
      statut: mode_paiement === "sur_place" ? "en_attente_paiement" : "confirmee",
      created_at: new Date().toISOString(),
    },
  });
}
