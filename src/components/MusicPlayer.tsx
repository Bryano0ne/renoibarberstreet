"use client";
import { useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    YT: {
      Player: new (el: HTMLElement | null, opts: object) => YTPlayer;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
    };
    onYouTubeIframeAPIReady: () => void;
    _ytBg?: YTPlayer;
  }
}

interface YTPlayer {
  playVideo(): void;
  setVolume(v: number): void;
  setShuffle(s: boolean): void;
}

// ─── Remplacer par l'ID de la vidéo YouTube biggplaya P&Z ───
// Ex: https://www.youtube.com/watch?v=XXXXXXXX  →  VIDEO_ID = "XXXXXXXX"
const VIDEO_ID = "OyxBbdX0Hq0"; // biggplaya P&Z feat Zayii
const PLAYLIST_FALLBACK = "PLjSLTEAvEnTkpdb17bv0r1BaROOs3yrMW";

export default function MusicPlayer() {
  const divRef = useRef<HTMLDivElement>(null);

  const init = useCallback(() => {
    if (!window.YT?.Player || !divRef.current) return;
    if (window._ytBg) return;

    const playerVars: Record<string, unknown> = {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
      loop: 1,
      origin: window.location.origin,
    };

    if (VIDEO_ID) {
      playerVars.playlist = VIDEO_ID;
    } else {
      playerVars.listType = "playlist";
      playerVars.list = PLAYLIST_FALLBACK;
    }

    window._ytBg = new window.YT.Player(divRef.current, {
      videoId: VIDEO_ID || undefined,
      height: "1",
      width: "1",
      playerVars,
      events: {
        onReady: (e: { target: YTPlayer }) => {
          e.target.setVolume(40);
          if (!VIDEO_ID) e.target.setShuffle(true);
          e.target.playVideo();
        },
      },
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.YT?.Player) {
      init();
    } else {
      if (!document.getElementById("yt-api")) {
        const s = document.createElement("script");
        s.id = "yt-api";
        s.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(s);
      }
      window.onYouTubeIframeAPIReady = init;
    }
  }, [init]);

  return (
    <div
      ref={divRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        width: 1,
        height: 1,
        opacity: 0,
        pointerEvents: "none",
        bottom: 0,
        left: 0,
        overflow: "hidden",
      }}
    />
  );
}
