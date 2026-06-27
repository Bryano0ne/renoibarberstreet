import { NextRequest } from "next/server";
import { BARBIERS_DEMO, PRESTATIONS_DEMO } from "@/lib/demo-data";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { salon, prestation_id, date, heure, client_nom, client_telephone } = body;

  if (!salon || !prestation_id || !date || !heure || !client_nom || !client_telephone) {
    return Response.json({ error: "Tous les champs sont obligatoires." }, { status: 400 });
  }

  const prestation = PRESTATIONS_DEMO.find((p) => p.id === prestation_id);
  if (!prestation) {
    return Response.json({ error: "Prestation introuvable." }, { status: 404 });
  }

  // Assignation automatique — barbier disponible dans le salon
  const barbiersDuSalon = BARBIERS_DEMO.filter(
    (b) => b.salon_nom === salon
  );
  const barbier = barbiersDuSalon[Math.floor(Math.random() * barbiersDuSalon.length)];

  const reservation = {
    id: `RNI-${Date.now().toString(36).toUpperCase()}`,
    salon,
    prestation: prestation.nom,
    prix_fcfa: prestation.prix_fcfa,
    date,
    heure,
    client_nom,
    client_telephone,
    barbier: barbier?.prenom ?? "Disponible",
    statut: "confirmee",
    created_at: new Date().toISOString(),
  };

  // En prod : INSERT INTO reservations + envoi WhatsApp/SMS via Africa's Talking

  return Response.json({ success: true, reservation }, { status: 201 });
}
