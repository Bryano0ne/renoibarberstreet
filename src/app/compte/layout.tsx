import { getSession } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export default async function CompteLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/connexion");
  return <>{children}</>;
}
