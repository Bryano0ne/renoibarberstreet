import { NextRequest } from "next/server";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: "ID manquant" }, { status: 400 });
  }

  // En prod : UPDATE reservations SET statut='annulee' WHERE id = id + notif WhatsApp
  return Response.json({ success: true, message: `Réservation ${id} annulée.` });
}
