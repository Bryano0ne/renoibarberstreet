"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, timingSafeEqual } from "crypto";
import { BARBIERS_DEMO } from "@/lib/demo-data";

function getPin(id: string): string {
  const env = process.env[`BARBIER_PIN_${id}`];
  if (env) return env;
  if (process.env.NODE_ENV === "production") return "";
  return ({ "1": "1111", "2": "2222", "3": "3333", "4": "4444" } as Record<string, string>)[id] || "";
}

function checkPin(provided: string, expected: string): boolean {
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected || "\0").digest();
  return timingSafeEqual(a, b) && !!expected;
}

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
  if (!barbier || !pin || !checkPin(pin, getPin(id))) return { error: "Identifiant ou PIN incorrect." };

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
