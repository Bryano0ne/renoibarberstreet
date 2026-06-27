import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  if (!cookieStore.get("renoi-barbier")?.value) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  // En prod : UPDATE reservations SET statut='noshow', noshow_at=NOW() WHERE id = id
  return Response.json({ success: true, message: `Réservation ${id} marquée no-show.` });
}
