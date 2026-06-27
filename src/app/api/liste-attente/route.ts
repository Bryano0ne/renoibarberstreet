import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { salon, prestation_id, date, client_nom, client_telephone } = body;

  if (!salon || !prestation_id || !date || !client_nom || !client_telephone) {
    return Response.json({ error: "Champs manquants." }, { status: 400 });
  }

  // En prod : INSERT INTO liste_attente + notif quand créneau se libère
  return Response.json({
    success: true,
    message: "Ajouté à la liste d'attente. Vous serez notifié par WhatsApp si un créneau se libère.",
    position: Math.floor(Math.random() * 3) + 1,
  });
}
