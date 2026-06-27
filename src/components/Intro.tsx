"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${5 + (i * 3.2) % 90}%`,
  delay: `${(i * 0.18) % 3}s`,
  duration: `${2 + (i % 5) * 0.4}s`,
  size: `${2 + (i % 4) * 2}px`,
  opacity: 0.3 + (i % 5) * 0.14,
}));

export default function Intro() {
  const [phase, setPhase] = useState<"idle" | "ready" | "leaving" | "done">("idle");
  const [muted, setMuted] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const seen = sessionStorage.getItem("renoi-intro-seen");
    if (seen) { setPhase("done"); return; }
    const t = setTimeout(() => setPhase("ready"), 60);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = () => {
    if (audioRef.current && !audioStarted) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => null);
      setAudioStarted(true);
    }
    if (videoRef.current) videoRef.current.play().catch(() => null);
    setPhase("leaving");

    setTimeout(() => {
      sessionStorage.setItem("renoi-intro-seen", "1");
      setPhase("done");
      // Fade out audio
      if (audioRef.current) {
        const audio = audioRef.current;
        const fade = setInterval(() => {
          if (audio.volume > 0.04) audio.volume = Math.max(0, audio.volume - 0.04);
          else { audio.pause(); clearInterval(fade); }
        }, 100);
      }
    }, 900);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#0A0A0A] ${
        phase === "leaving" ? "intro-wipe-out" : ""
      }`}
    >
      {/* Vidéo fond */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/images/salon-intro.mp4"
        loop muted playsInline preload="auto"
        style={{ opacity: 0.25 }}
      />

      {/* Overlays */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at center, rgba(20,8,0,0.7) 0%, rgba(10,10,10,0.85) 60%, #0A0A0A 100%)"
      }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/50 via-transparent to-[#0A0A0A]/80" />

      {/* Grille décorative */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      {/* Scanline */}
      <div className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg,transparent,#C9A84C40,transparent)", animation: "scanline 4s linear infinite", top: 0 }} />

      {/* Particules */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {phase === "ready" && PARTICLES.map((p) => (
          <div key={p.id} className="absolute rounded-full bg-[#C9A84C]"
            style={{ left: p.left, bottom: "5%", width: p.size, height: p.size,
              animation: `introParticle ${p.duration} ease-out ${p.delay} infinite`,
              opacity: p.opacity }} />
        ))}
      </div>

      {/* Contenu */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 select-none">

        {/* Logo */}
        <div className="intro-logo-reveal mb-5">
          <div className="relative mx-auto rounded-full overflow-hidden"
            style={{ width: 148, height: 148,
              boxShadow: "0 0 0 3px rgba(201,168,76,0.5), 0 0 40px rgba(201,168,76,0.25), 0 0 80px rgba(201,168,76,0.1)" }}>
            <Image src="/images/logo.jpg" alt="Renoï Barberstreet" fill sizes="148px" className="object-cover" priority />
          </div>
        </div>

        {/* Ligne */}
        <div className="intro-line-grow h-px mb-5 mx-auto"
          style={{ background: "linear-gradient(90deg,transparent,#C9A84C,transparent)" }} />

        {/* Titre */}
        <div className="mb-1">
          <h1 className="intro-title-slide intro-glitch font-black leading-none mb-1 drop-shadow-2xl"
            style={{ fontSize: "clamp(2.8rem,11vw,6.5rem)", color: "#F5F0E8", letterSpacing: "0.15em" }}>
            RENOI
          </h1>
          <p className="intro-title-slide font-black tracking-[0.35em] text-[#C9A84C] drop-shadow-lg"
            style={{ fontSize: "clamp(1.1rem,4vw,2rem)", animationDelay: "1.6s" }}>
            BARBERSTREET
          </p>
        </div>

        <p className="intro-sub-slide text-[#F5F0E8]/35 text-xs tracking-[0.6em] uppercase mt-3 mb-8">
          Ouagadougou · La valeur sûre 💈
        </p>

        {/* Bouton ENTRER */}
        {phase === "ready" && (
          <button
            onClick={handleEnter}
            className="intro-enter-pulse group relative overflow-hidden border-2 border-[#C9A84C] text-[#C9A84C] font-black px-14 py-4 rounded-full tracking-[0.4em] uppercase text-sm hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-300"
          >
            <span className="relative z-10">✦ ENTRER ✦</span>
            <span className="absolute inset-0 rounded-full overflow-hidden">
              <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700" />
            </span>
          </button>
        )}

        {/* Ligne basse */}
        <div className="intro-line-grow h-px mt-7 mx-auto"
          style={{ background: "linear-gradient(90deg,transparent,#C9A84C,transparent)" }} />

        <p className="mt-4 text-[#F5F0E8]/15 text-[10px] tracking-[0.4em] uppercase">
          Premium Barbershop · 7j/7 · 9h–21h
        </p>
      </div>

      {/* Contrôle son */}
      <button onClick={toggleMute}
        className="absolute bottom-8 right-6 z-20 text-[#F5F0E8]/30 hover:text-[#C9A84C] transition-colors flex items-center gap-2 text-xs tracking-widest uppercase"
        aria-label={muted ? "Activer le son" : "Couper le son"}>
        {muted ? (
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
        )}
        <span>{muted ? "Son off" : "Son on"}</span>
      </button>

      <audio ref={audioRef} src="/audio/intro.wav" preload="auto" loop />
    </div>
  );
}
