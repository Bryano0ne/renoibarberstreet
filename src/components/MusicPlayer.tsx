"use client";
import { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted]     = useState(false);
  const [ready, setReady]     = useState(false);
  const [playing, setPlaying] = useState(false);

  // Démarre la lecture dès que l'utilisateur interagit pour la première fois
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.35;
    audio.loop   = true;

    const tryPlay = () => {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    };

    // Tentative auto-play immédiate (marche si le navigateur l'autorise)
    tryPlay();

    // Sinon, on accroche au premier geste utilisateur
    const onInteract = () => {
      tryPlay();
      window.removeEventListener("click",    onInteract);
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("keydown",  onInteract);
    };
    window.addEventListener("click",     onInteract, { once: true });
    window.addEventListener("touchstart", onInteract, { once: true, passive: true });
    window.addEventListener("keydown",   onInteract, { once: true });

    audio.addEventListener("canplay", () => setReady(true));

    return () => {
      window.removeEventListener("click",    onInteract);
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("keydown",  onInteract);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (muted) {
      audio.muted = false;
      setMuted(false);
      // Si elle n'avait pas encore démarré, on lance maintenant
      if (!playing) audio.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      audio.muted = true;
      setMuted(true);
    }
  };

  return (
    <>
      {/* Audio invisible en boucle */}
      <audio
        ref={audioRef}
        src="/audio/bg-music.mp3"
        preload="auto"
        playsInline
        aria-hidden="true"
      />

      {/* Bouton mute — visible seulement quand le fichier est prêt */}
      {ready && (
        <button
          onClick={toggle}
          aria-label={muted ? "Activer la musique" : "Couper la musique"}
          title={muted ? "Activer la musique" : "Couper la musique"}
          className="fixed bottom-24 right-4 z-50 flex items-center justify-center w-9 h-9 rounded-full bg-[#0A0A0A]/80 border border-[#C9A84C]/30 backdrop-blur-sm text-base hover:border-[#C9A84C]/70 hover:bg-[#111111] transition-all shadow-lg shadow-black/40 select-none"
        >
          {muted ? "🔇" : "🔊"}
        </button>
      )}
    </>
  );
}
