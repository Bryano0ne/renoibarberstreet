"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "crypto";

export interface Session {
  id: string;
  nom: string;
  telephone: string;
}

function signSession(payload: Session): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") throw new Error("SESSION_SECRET non configuré");
    return JSON.stringify(payload); // dev uniquement
  }
  const b64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret).update(b64).digest("base64url");
  return `${b64}.${sig}`;
}

function verifySession(raw: string): Session | null {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    try { return JSON.parse(raw) as Session; } catch { return null; }
  }
  const dot = raw.lastIndexOf(".");
  if (dot === -1) return null;
  const b64 = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  try {
    const expected = createHmac("sha256", secret).update(b64).digest("base64url");
    const sigBuf = Buffer.from(sig, "base64url");
    const expBuf = Buffer.from(expected, "base64url");
    if (sigBuf.length !== expBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expBuf)) return null;
    return JSON.parse(Buffer.from(b64, "base64url").toString()) as Session;
  } catch { return null; }
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("renoi-session")?.value;
  if (!raw) return null;
  return verifySession(raw);
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
  cookieStore.set("renoi-session", signSession(session), {
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
