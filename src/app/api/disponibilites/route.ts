import { NextRequest } from "next/server";

// Créneaux occupés simulés (en prod → requête Supabase)
const PRISES: Record<string, string[]> = {};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const salon = searchParams.get("salon");

  if (!date || !salon) {
    return Response.json({ error: "date et salon requis" }, { status: 400 });
  }
  if (!["ZAD", "SAABA"].includes(salon)) {
    return Response.json({ error: "Salon invalide." }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ error: "Format de date invalide (YYYY-MM-DD)." }, { status: 400 });
  }

  const key = `${salon}_${date}`;
  const occupes = PRISES[key] ?? [];

  // Créneaux 9h00–20h30, toutes les 30 min
  const slots: { heure: string; disponible: boolean }[] = [];
  for (let h = 9; h < 21; h++) {
    for (const m of [0, 30]) {
      const heure = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      slots.push({ heure, disponible: !occupes.includes(heure) });
    }
  }

  return Response.json(slots);
}
