import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function GET(_req: NextRequest) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("renoi-barbier")?.value;
  if (!raw) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const session = JSON.parse(raw) as { prenom: string };

  // Données demo — en prod : requête Supabase filtrée par barbier_id
  const statsParBarbier: Record<string, object> = {
    Moussa:  { coupes_mois: 241, revenu_genere: 771200, note_moy: 4.8, no_shows: 3, top_prestation: "Dégradé Classique", heure_pointe: "10h–12h" },
    Ibrahim: { coupes_mois: 117, revenu_genere: 351000, note_moy: 4.6, no_shows: 2, top_prestation: "Rasage Traditionnel", heure_pointe: "14h–16h" },
    Seydou:  { coupes_mois: 163, revenu_genere: 733500, note_moy: 4.9, no_shows: 1, top_prestation: "Combo Coupe + Barbe", heure_pointe: "09h–11h" },
    Hamidou: { coupes_mois: 128, revenu_genere: 512000, note_moy: 4.7, no_shows: 4, top_prestation: "Afro Sculpté",        heure_pointe: "15h–18h" },
  };

  const stats = statsParBarbier[session.prenom] ?? {
    coupes_mois: 0, revenu_genere: 0, note_moy: 0, no_shows: 0,
    top_prestation: "—", heure_pointe: "—",
  };

  return Response.json({ barbier: session.prenom, ...stats });
}
