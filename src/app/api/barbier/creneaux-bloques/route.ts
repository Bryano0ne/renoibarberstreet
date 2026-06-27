import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const bloques: Record<string, { id: string; date: string; heure_debut: string; heure_fin: string; raison: string; barbier_id: string }[]> = {};

async function getSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("renoi-barbier")?.value;
  if (!raw) return null;
  return JSON.parse(raw) as { id: string; prenom: string };
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const key = `${session.id}_${date}`;

  return Response.json(bloques[key] || []);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { date, heure_debut, heure_fin, raison } = body;

  if (!date || !heure_debut || !heure_fin) {
    return Response.json({ error: "Champs manquants." }, { status: 400 });
  }

  const key = `${session.id}_${date}`;
  if (!bloques[key]) bloques[key] = [];

  const slot = {
    id: `BLK-${Date.now()}`,
    date, heure_debut, heure_fin,
    raison: raison || "Indisponible",
    barbier_id: session.id,
  };
  bloques[key].push(slot);

  return Response.json({ success: true, slot }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const date = searchParams.get("date") || "";
  const key = `${session.id}_${date}`;

  if (bloques[key]) {
    bloques[key] = bloques[key].filter(b => b.id !== id);
  }
  return Response.json({ success: true });
}
