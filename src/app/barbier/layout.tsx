import { getBarbierSession } from "@/app/actions/barbier";
import { redirect } from "next/navigation";

export default async function BarbierLayout({ children }: { children: React.ReactNode }) {
  const session = await getBarbierSession();
  if (!session) redirect("/barbier/connexion");
  return <>{children}</>;
}
