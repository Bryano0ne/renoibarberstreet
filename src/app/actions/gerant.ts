"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function gerantConnexion(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | never> {
  const password = formData.get("password") as string;
  const expected = process.env.GERANT_PASSWORD;
  if (!expected) throw new Error("GERANT_PASSWORD non configuré.");

  if (!password || password !== expected) {
    return { error: "Mot de passe incorrect." };
  }

  const cookieStore = await cookies();
  cookieStore.set("renoi-gerant", "1", {
    maxAge: 60 * 60 * 8,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/gerant");
}

export async function gerantDeconnexion() {
  const cookieStore = await cookies();
  cookieStore.delete("renoi-gerant");
  redirect("/gerant/connexion");
}

export async function isGerantConnected(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("renoi-gerant")?.value === "1";
}
