import { NextRequest } from "next/server";
import { cookies } from "next/headers";

// En prod → table depenses dans Supabase
const depenses: {
  id: string; date: string; salon: string; categorie: string;
  description: string; montant: number;
}[] = [
  { id: "D001", date: "2026-06-25", salon: "ZAD",   categorie: "Produits",     description: "Cires et soins cheveux",    montant: 45000  },
  { id: "D002", date: "2026-06-24", salon: "SAABA", categorie: "Matériel",     description: "Tondeuse Wahl remplacement", montant: 65000  },
  { id: "D003", date: "2026-06-22", salon: "ZAD",   categorie: "Électricité",  description: "Facture SONABEL juin",       montant: 28000  },
  { id: "D004", date: "2026-06-20", salon: "SAABA", categorie: "Produits",     description: "Huile de rasage et lames",   montant: 22000  },
  { id: "D005", date: "2026-06-15", salon: "ZAD",   categorie: "Loyer",        description: "Loyer mensuel ZAD",          montant: 150000 },
  { id: "D006", date: "2026-06-15", salon: "SAABA", categorie: "Loyer",        description: "Loyer mensuel SAABA",        montant: 120000 },
  { id: "D007", date: "2026-06-10", salon: "ZAD",   categorie: "Salaires",     description: "Salaires barbiers ZAD",      montant: 300000 },
  { id: "D008", date: "2026-06-10", salon: "SAABA", categorie: "Salaires",     description: "Salaires barbiers SAABA",    montant: 240000 },
];

async function checkAuth() {
  const cookieStore = await cookies();
  return cookieStore.get("renoi-gerant")?.value === "1";
}

export async function GET(_req: NextRequest) {
  if (!(await checkAuth())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  return Response.json(depenses.sort((a, b) => b.date.localeCompare(a.date)));
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth())) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { salon, categorie, description, montant, date } = body;

  if (!salon || !categorie || !description || !montant) {
    return Response.json({ error: "Champs manquants." }, { status: 400 });
  }
  if (!["ZAD", "SAABA"].includes(salon)) {
    return Response.json({ error: "Salon invalide." }, { status: 400 });
  }
  const CATEGORIES_VALIDES = ["Produits", "Matériel", "Électricité", "Loyer", "Salaires", "Autre"];
  if (!CATEGORIES_VALIDES.includes(categorie)) {
    return Response.json({ error: "Catégorie invalide." }, { status: 400 });
  }
  const montantNum = Number(montant);
  if (!Number.isFinite(montantNum) || montantNum <= 0 || montantNum > 10_000_000) {
    return Response.json({ error: "Montant invalide." }, { status: 400 });
  }
  if (typeof description !== "string" || description.trim().length < 2 || description.trim().length > 200) {
    return Response.json({ error: "Description invalide." }, { status: 400 });
  }

  const dep = {
    id: `D${String(depenses.length + 1).padStart(3, "0")}`,
    date: date || new Date().toISOString().split("T")[0],
    salon, categorie,
    description: description.trim(),
    montant: montantNum,
  };

  depenses.unshift(dep);
  return Response.json({ success: true, depense: dep }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAuth())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const idx = depenses.findIndex(d => d.id === id);
  if (idx === -1) return Response.json({ error: "Introuvable" }, { status: 404 });
  depenses.splice(idx, 1);
  return Response.json({ success: true });
}
