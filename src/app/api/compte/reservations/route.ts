import { NextRequest } from "next/server";
import { cookies } from "next/headers";

// Historique demo — en prod : SELECT * FROM reservations WHERE client_telephone = session.telephone
const HISTORIQUE_DEMO = [
  { id: "RNI-M9KA1", salon: "ZAD", prestation: "Dégradé Classique", prix_fcfa: 3000, date: "2026-06-20", heure: "10:00", barbier: "Moussa", statut: "terminee", note: 5 },
  { id: "RNI-L7BP2", salon: "ZAD", prestation: "Taille de Barbe", prix_fcfa: 1500, date: "2026-06-06", heure: "14:30", barbier: "Ibrahim", statut: "terminee", note: null },
  { id: "RNI-K3XQ9", salon: "SAABA", prestation: "Combo Coupe + Barbe", prix_fcfa: 4500, date: "2026-05-18", heure: "11:00", barbier: "Seydou", statut: "terminee", note: 5 },
  { id: "RNI-J2WR4", salon: "ZAD", prestation: "Dégradé Classique", prix_fcfa: 3000, date: "2026-05-04", heure: "09:30", barbier: "Moussa", statut: "terminee", note: 4 },
  { id: "RNI-H8NM7", salon: "ZAD", prestation: "Rasage Traditionnel", prix_fcfa: 2000, date: "2026-04-21", heure: "16:00", barbier: "Ibrahim", statut: "terminee", note: 5 },
  { id: "RNI-G1PC3", salon: "ZAD", prestation: "Dégradé Classique", prix_fcfa: 3000, date: "2026-04-07", heure: "10:00", barbier: "Moussa", statut: "terminee", note: 5 },
  { id: "RNI-F5QD6", salon: "SAABA", prestation: "Afro Sculpté", prix_fcfa: 4000, date: "2026-03-24", heure: "13:00", barbier: "Hamidou", statut: "terminee", note: null },
  { id: "RNI-E4TS8", salon: "ZAD", prestation: "Coupe Classique", prix_fcfa: 2500, date: "2026-03-10", heure: "11:30", barbier: "Moussa", statut: "terminee", note: 4 },
];

export async function GET(_req: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get("renoi-session");
  if (!session) return Response.json({ error: "Non connecté" }, { status: 401 });

  return Response.json(HISTORIQUE_DEMO);
}
