import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { note, commentaire, prenom, salon, reservation_id } = body;

  if (!note || note < 1 || note > 5) {
    return Response.json({ error: "Note invalide (1 à 5)." }, { status: 400 });
  }
  if (!salon || !["ZAD", "SAABA"].includes(salon)) {
    return Response.json({ error: "Salon invalide." }, { status: 400 });
  }

  // Récupérer le nom depuis la session si connecté, sinon depuis le champ prenom
  const cookieStore = await cookies();
  const sessionRaw = cookieStore.get("renoi-session")?.value;
  let clientNom = prenom?.trim() || "";

  if (sessionRaw) {
    try {
      const session = JSON.parse(sessionRaw);
      if (session.nom) clientNom = session.nom;
    } catch {}
  }

  if (!clientNom || clientNom.length > 80) {
    return Response.json({ error: "Prénom requis (max 80 caractères)." }, { status: 400 });
  }
  if (commentaire && (typeof commentaire !== "string" || commentaire.length > 500)) {
    return Response.json({ error: "Commentaire trop long (max 500 caractères)." }, { status: 400 });
  }
  if (reservation_id && (typeof reservation_id !== "string" || reservation_id.length > 30)) {
    return Response.json({ error: "ID réservation invalide." }, { status: 400 });
  }

  const avis = {
    id: `AV-${Date.now().toString(36).toUpperCase()}`,
    reservation_id: reservation_id || null,
    client_nom: clientNom,
    salon,
    note,
    commentaire: commentaire?.trim() || "",
    created_at: new Date().toISOString(),
  };

  // En prod : INSERT INTO avis VALUES (...)
  return Response.json({ success: true, avis }, { status: 201 });
}
