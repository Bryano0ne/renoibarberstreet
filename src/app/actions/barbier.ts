"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BARBIERS_DEMO } from "@/lib/demo-data";

// PINs demo — en prod → hachés dans Supabase
const PINS: Record<string, string> = {
  "1": "1111", // Moussa
  "2": "2222", // Ibrahim
  "3": "3333", // Seydou
  "4": "4444", // Hamidou
};

export interface BarbierSession {
  id: string;
  prenom: string;
  salon_nom: string;
  salon_id: string;
}

export async function getBarbierSession(): Promise<BarbierSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("renoi-barbier")?.value;
  if (!raw) return null;
  try { return JSON.parse(raw) as BarbierSession; } catch { return null; }
}

export async function barbierConnexion(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | never> {
  const id  = formData.get("barbier_id") as string;
  const pin = formData.get("pin") as string;

  const barbier = BARBIERS_DEMO.find(b => b.id === id);
  if (!barbier) return { error: "Barbier introuvable." };
  if (!pin || PINS[id] !== pin) return { error: "PIN incorrect." };

  const session: BarbierSession = {
    id: barbier.id,
    prenom: barbier.prenom,
    salon_nom: barbier.salon_nom,
    salon_id: barbier.salon_id,
  };

  const cookieStore = await cookies();
  cookieStore.set("renoi-barbier", JSON.stringify(session), {
    maxAge: 60 * 60 * 12,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/barbier");
}

export async function barbierDeconnexion() {
  const cookieStore = await cookies();
  cookieStore.delete("renoi-barbier");
  redirect("/barbier/connexion");
}
