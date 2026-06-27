import { isGerantConnected } from "@/app/actions/gerant";
import { redirect } from "next/navigation";

export default async function GerantLayout({ children }: { children: React.ReactNode }) {
  const ok = await isGerantConnected();
  if (!ok) redirect("/gerant/connexion");
  return <>{children}</>;
}
