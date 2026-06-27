import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  if (cookieStore.get("renoi-gerant")?.value !== "1") {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "semaine"; // semaine | mois

  const now = new Date();
  const periodeLabel = type === "mois"
    ? `${["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"][now.getMonth()]} ${now.getFullYear()}`
    : `Semaine du ${new Date(now.getTime() - 6 * 86400000).toLocaleDateString("fr-FR")} au ${now.toLocaleDateString("fr-FR")}`;

  const rapport = {
    periode: periodeLabel,
    type,
    genere_le: now.toISOString(),
    salons: {
      ZAD: {
        coupes: type === "mois" ? 682 : 163,
        revenus: type === "mois" ? 2186400 : 521600,
        top_prestation: "Dégradé Classique",
        top_prestation_count: type === "mois" ? 241 : 57,
        barbier_top: "Moussa",
        barbier_coupes: type === "mois" ? 358 : 86,
        heure_pointe: "10h00–13h00",
        jour_pointe: "Samedi",
      },
      SAABA: {
        coupes: type === "mois" ? 534 : 128,
        revenus: type === "mois" ? 1712800 : 410300,
        top_prestation: "Combo Coupe + Barbe",
        top_prestation_count: type === "mois" ? 163 : 39,
        barbier_top: "Seydou",
        barbier_coupes: type === "mois" ? 291 : 70,
        heure_pointe: "14h00–17h00",
        jour_pointe: "Dimanche",
      },
    },
    totaux: {
      coupes: type === "mois" ? 1216 : 291,
      revenus: type === "mois" ? 3899200 : 931900,
      depenses: type === "mois" ? 970000 : 232000,
      benefice: type === "mois" ? 2929200 : 699900,
      marge_pct: type === "mois" ? 75.1 : 75.1,
    },
    prestations_top: [
      { nom: "Dégradé Classique", coupes: type === "mois" ? 398 : 95, revenus: type === "mois" ? 1194000 : 285000 },
      { nom: "Combo Coupe + Barbe", coupes: type === "mois" ? 287 : 69, revenus: type === "mois" ? 1291500 : 310500 },
      { nom: "Taille de Barbe",     coupes: type === "mois" ? 201 : 48, revenus: type === "mois" ? 301500  : 72000  },
      { nom: "Afro Sculpté",        coupes: type === "mois" ? 156 : 37, revenus: type === "mois" ? 624000  : 148000 },
      { nom: "Coupe Classique",     coupes: type === "mois" ? 174 : 42, revenus: type === "mois" ? 435000  : 105000 },
    ],
  };

  return Response.json(rapport);
}
