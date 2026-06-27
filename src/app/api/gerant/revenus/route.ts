import { NextRequest } from "next/server";
import { cookies } from "next/headers";

// Génère des données de revenus réalistes sur 30 jours
function genRevenusDemo() {
  const today = new Date();
  const jours: { date: string; zad: number; saaba: number; coupes_zad: number; coupes_saaba: number }[] = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    // Revenus réalistes avec variation weekend
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const base = isWeekend ? 1.4 : 1;
    const noise = () => 0.8 + Math.random() * 0.4;

    const coupes_zad = Math.round((isWeekend ? 35 : 25) * noise());
    const coupes_saaba = Math.round((isWeekend ? 28 : 20) * noise());

    jours.push({
      date: dateStr,
      zad: Math.round(coupes_zad * 3200 * noise() * base),
      saaba: Math.round(coupes_saaba * 3000 * noise() * base),
      coupes_zad,
      coupes_saaba,
    });
  }
  return jours;
}

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  if (cookieStore.get("renoi-gerant")?.value !== "1") {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const periode = searchParams.get("periode") || "mois"; // jour | semaine | mois | an
  const salon = searchParams.get("salon") || "tous"; // ZAD | SAABA | tous

  const data = genRevenusDemo();

  return Response.json({ periode, salon, jours: data });
}
