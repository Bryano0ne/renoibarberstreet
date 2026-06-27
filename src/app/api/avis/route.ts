import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionRaw = cookieStore.get("renoi-session")?.value;
  if (!sessionRaw) return Response.json({ error: "Non connecté" }, { status: 401 });

  const session = JSON.parse(sessionRaw);
  const body = await req.json();
  const { reservation_id, note, commentaire } = body;

  if (!reservation_id || !note || note < 1 || note > 5) {
    return Response.json({ error: "Données invalides." }, { status: 400 });
  }

  // En prod : INSERT INTO avis + UPDATE reservations SET note = note WHERE id = reservation_id
  const avis = {
    id: `AV-${Date.now().toString(36).toUpperCase()}`,
    reservation_id,
    client_nom: session.nom,
    note,
    commentaire: commentaire || "",
    created_at: new Date().toISOString(),
  };

  return Response.json({ success: true, avis }, { status: 201 });
}
