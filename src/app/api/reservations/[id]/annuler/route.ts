import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  if (!cookieStore.get("renoi-session")?.value) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return Response.json({ error: "ID manquant" }, { status: 400 });
  }

  // En prod : UPDATE reservations SET statut='annulee' WHERE id = id AND client_telephone = session.telephone
  return Response.json({ success: true, message: `Réservation ${id} annulée.` });
}
