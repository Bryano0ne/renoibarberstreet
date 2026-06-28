import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { salon, prestation_id, date, client_nom, client_telephone } = body;

  if (!salon || !prestation_id || !date || !client_nom || !client_telephone) {
    return Response.json({ error: "Champs manquants." }, { status: 400 });
  }
  if (!["ZAD", "SAABA"].includes(salon)) {
    return Response.json({ error: "Salon invalide." }, { status: 400 });
  }
  if (typeof client_telephone !== "string" || client_telephone.length < 8 || client_telephone.length > 20) {
    return Response.json({ error: "Numéro de téléphone invalide." }, { status: 400 });
  }
  if (typeof client_nom !== "string" || client_nom.trim().length < 2 || client_nom.trim().length > 80) {
    return Response.json({ error: "Nom invalide." }, { status: 400 });
  }

  // En prod : INSERT INTO liste_attente + notif quand créneau se libère
  return Response.json({
    success: true,
    message: "Ajouté à la liste d'attente. Vous serez notifié par WhatsApp si un créneau se libère.",
    position: Math.floor(Math.random() * 3) + 1,
  });
}
