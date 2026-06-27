import { getSession } from "@/app/actions/auth";
import { deconnexion } from "@/app/actions/auth";
import CompteDashboard from "@/components/compte/CompteDashboard";

export default async function ComptePage() {
  const session = await getSession();

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header profil */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#C9A84C]/10 border-2 border-[#C9A84C]/40 flex items-center justify-center">
              <span className="text-[#C9A84C] font-black text-xl">
                {session!.nom.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-black text-[#F5F0E8]">{session!.nom}</h1>
              <p className="text-[#F5F0E8]/40 text-sm">{session!.telephone}</p>
            </div>
          </div>
          <form action={deconnexion}>
            <button type="submit" className="text-[#F5F0E8]/25 text-xs hover:text-red-400 transition-colors px-3 py-2 border border-[#2A2A2A] rounded-lg hover:border-red-400/30">
              Déconnexion
            </button>
          </form>
        </div>

        <CompteDashboard clientId={session!.id} clientNom={session!.nom} />
      </div>
    </main>
  );
}
