import { NextRequest } from "next/server";

// En prod → table cartes_cadeaux dans Supabase
const cartes: Record<string, { code: string; montant: number; utilise: boolean; created_at: string }> = {
  "RENOI-DEMO-2026": { code: "RENOI-DEMO-2026", montant: 5000, utilise: false, created_at: "2026-06-01" },
};

function genCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `RENOI-${part()}-${part()}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return Response.json({ error: "Code requis" }, { status: 400 });
  if (code.length > 20) return Response.json({ error: "Code invalide." }, { status: 400 });

  const carte = cartes[code.toUpperCase()];
  if (!carte) return Response.json({ error: "Carte introuvable ou invalide." }, { status: 404 });
  if (carte.utilise) return Response.json({ error: "Cette carte a déjà été utilisée." }, { status: 409 });

  return Response.json(carte);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { montant } = body;

  if (![5000, 10000, 15000, 20000].includes(Number(montant))) {
    return Response.json({ error: "Montant invalide." }, { status: 400 });
  }

  const code = genCode();
  cartes[code] = { code, montant: Number(montant), utilise: false, created_at: new Date().toISOString() };

  // En prod: INSERT INTO cartes_cadeaux + envoyer par WhatsApp / email
  return Response.json({ success: true, carte: cartes[code] }, { status: 201 });
}
