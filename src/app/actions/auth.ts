"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface Session {
  id: string;
  nom: string;
  telephone: string;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("renoi-session")?.value;
  if (!raw) return null;
  try { return JSON.parse(raw) as Session; } catch { return null; }
}

export async function connexion(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | never> {
  const telephone = (formData.get("telephone") as string)?.trim();
  const nom = (formData.get("nom") as string)?.trim() || "Client";

  if (!telephone || telephone.length < 8) {
    return { error: "Numéro de téléphone invalide." };
  }

  const session: Session = {
    id: `CLI-${Date.now().toString(36).toUpperCase()}`,
    nom,
    telephone,
  };

  const cookieStore = await cookies();
  cookieStore.set("renoi-session", JSON.stringify(session), {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/compte");
}

export async function deconnexion() {
  const cookieStore = await cookies();
  cookieStore.delete("renoi-session");
  redirect("/");
}
