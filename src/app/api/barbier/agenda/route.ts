import { NextRequest } from "next/server";
import { cookies } from "next/headers";

// Génère des RDV demo pour aujourd'hui
function genAgendaDemo(barbierPrenom: string, date: string) {
  const PRESTATIONS_DUREES = [
    { nom: "Dégradé Classique", duree: 45, prix: 3000 },
    { nom: "Combo Coupe + Barbe", duree: 75, prix: 4500 },
    { nom: "Taille de Barbe",    duree: 20, prix: 1500 },
    { nom: "Coupe Classique",    duree: 30, prix: 2500 },
    { nom: "Afro Sculpté",       duree: 60, prix: 4000 },
  ];
  const CLIENTS = ["Kader S.", "Issouf T.", "Romuald K.", "Abdoul W.", "Salif O.", "Daouda N.", "Moustapha B.", "Seybou D."];
  const rdvs = [];
  let heure = 9 * 60; // 9h en minutes
  let id = 1;

  while (heure < 20 * 60) {
    const presta = PRESTATIONS_DUREES[Math.floor(Math.random() * PRESTATIONS_DUREES.length)];
    const gap = Math.random() > 0.3 ? 0 : 30; // pause occasionnelle
    const statuts = ["confirme", "confirme", "confirme", "termine", "noshow"];
    const statut = new Date(`${date}T${String(Math.floor(heure/60)).padStart(2,"0")}:${String(heure%60).padStart(2,"0")}`) < new Date()
      ? statuts[Math.floor(Math.random() * statuts.length)]
      : "confirme";

    rdvs.push({
      id: `RNI-${barbierPrenom.toUpperCase().slice(0,3)}${id}`,
      heure_debut: `${String(Math.floor(heure/60)).padStart(2,"0")}:${String(heure%60).padStart(2,"0")}`,
      heure_fin: `${String(Math.floor((heure+presta.duree)/60)).padStart(2,"0")}:${String((heure+presta.duree)%60).padStart(2,"0")}`,
      duree_min: presta.duree,
      prestation: presta.nom,
      prix_fcfa: presta.prix,
      client_nom: CLIENTS[Math.floor(Math.random() * CLIENTS.length)],
      statut,
    });

    heure += presta.duree + gap + 5;
    id++;
    if (rdvs.length >= 9) break;
  }
  return rdvs;
}

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("renoi-barbier")?.value;
  if (!raw) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const session = JSON.parse(raw);
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

  const rdvs = genAgendaDemo(session.prenom, date);
  return Response.json({ barbier: session.prenom, salon: session.salon_nom, date, rdvs });
}
