"use client";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Déjà installé ou déjà rejeté
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      localStorage.getItem("renoi-pwa-dismissed") === "1"
    ) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      // Attendre 3s avant d'afficher
      setTimeout(() => setVisible(true), 3000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
      setPrompt(null);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem("renoi-pwa-dismissed", "1");
  };

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-sm animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#111111] border border-[#C9A84C]/30 rounded-2xl p-4 shadow-2xl shadow-black/60">
        <div className="flex items-start gap-3">
          {/* Icône */}
          <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] flex items-center justify-center shrink-0">
            <span className="text-xl">✂️</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#F5F0E8] font-black text-sm mb-0.5">Installer Renoï</p>
            <p className="text-[#F5F0E8]/40 text-xs leading-relaxed">
              Accède à ton barbier en un tap — sans navigateur, sans délai.
            </p>
          </div>
          <button onClick={handleDismiss} className="text-[#F5F0E8]/20 hover:text-[#F5F0E8]/60 transition-colors text-xl leading-none shrink-0 mt-0.5">
            ×
          </button>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleDismiss}
            className="flex-1 py-2.5 text-xs font-semibold text-[#F5F0E8]/30 border border-[#2A2A2A] rounded-xl hover:border-[#3A3A3A] transition-all">
            Plus tard
          </button>
          <button onClick={handleInstall}
            className="flex-1 py-2.5 text-xs font-black bg-[#C9A84C] text-[#0A0A0A] rounded-xl hover:bg-[#E2C47A] transition-all">
            📲 Installer
          </button>
        </div>
      </div>
    </div>
  );
}
