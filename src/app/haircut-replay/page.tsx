"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { formatFCFA } from "@/lib/utils";

// ─── Données demo ─────────────────────────────────────────────

const WEEKLY_DATA = [
  { label: "S-7", value: 3000 },
  { label: "S-6", value: 0 },
  { label: "S-5", value: 4500 },
  { label: "S-4", value: 3000 },
  { label: "S-3", value: 3000 },
  { label: "S-2", value: 0 },
  { label: "S-1", value: 4500 },
  { label: "Cette s.", value: 3000 },
];

const MONTHLY_DATA = [
  { label: "Avril", value: 12000 },
  { label: "Mai", value: 16000 },
  { label: "Juin", value: 9000 },
];

const TOTAL_COUPES = 12;
const TOTAL_DEPENSES = 37000;
const ECONOMIES = 3000;
const POINTS = TOTAL_COUPES * 50;
const PROCHAINE_GRATUITE = 10 - (TOTAL_COUPES % 10);

// ─── SVG Bar Chart ─────────────────────────────────────────────

function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const W = 360;
  const H = 90;
  const bottomPad = 20;
  const barW = Math.min(36, (W - 20) / data.length - 6);
  const totalBarW = barW * data.length;
  const totalGap = W - 20 - totalBarW;
  const gap = totalGap / (data.length + 1);

  return (
    <svg
      viewBox={`0 0 ${W} ${H + bottomPad}`}
      className="w-full"
      style={{ overflow: "visible" }}
    >
      {data.map((d, i) => {
        const x = 10 + gap + i * (barW + gap);
        const barH = d.value > 0 ? Math.max(6, (d.value / max) * (H - 16)) : 2;
        const y = H - barH;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx={4}
              fill={d.value > 0 ? "#C9A84C" : "#1A1A1A"}
              opacity={0.9}
            />
            <text
              x={x + barW / 2}
              y={H + bottomPad - 3}
              textAnchor="middle"
              fontSize={8}
              fill="rgba(245,240,232,0.3)"
            >
              {d.label}
            </text>
            {d.value > 0 && barH > 14 && (
              <text
                x={x + barW / 2}
                y={y - 4}
                textAnchor="middle"
                fontSize={7}
                fill="#C9A84C"
              >
                {formatFCFA(d.value)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Stats Tab ─────────────────────────────────────────────────

function StatsTab() {
  const [view, setView] = useState<"semaine" | "mois">("semaine");

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="flex gap-1 bg-[#111111] border border-[#2A2A2A] rounded-xl p-1">
        {(["semaine", "mois"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 py-2 text-sm font-black rounded-lg transition-all capitalize ${
              view === v
                ? "bg-[#C9A84C] text-[#0A0A0A]"
                : "text-[#F5F0E8]/40 hover:text-[#F5F0E8]/70"
            }`}
          >
            Par {v}
          </button>
        ))}
      </div>

      {/* Graphique */}
      <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5">
        <p className="text-[10px] text-[#F5F0E8]/30 tracking-widest uppercase mb-4">
          Dépenses {view === "semaine" ? "— 8 dernières semaines" : "— 3 derniers mois"}
        </p>
        <BarChart data={view === "semaine" ? WEEKLY_DATA : MONTHLY_DATA} />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          {
            label: "Total dépensé",
            value: formatFCFA(TOTAL_DEPENSES),
            sub: "depuis le début",
            icon: "💸",
          },
          {
            label: "Économies",
            value: formatFCFA(ECONOMIES),
            sub: "coupes gratuites",
            icon: "🎁",
          },
          {
            label: "Total coupes",
            value: `${TOTAL_COUPES}`,
            sub: "coupes réalisées",
            icon: "✂️",
          },
          {
            label: "Points fidélité",
            value: `${POINTS} pts`,
            sub: `= ${formatFCFA(POINTS * 10)}`,
            icon: "⭐",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-4"
          >
            <span className="text-2xl mb-2 block">{kpi.icon}</span>
            <p className="text-[#C9A84C] font-black text-lg leading-none mb-1">
              {kpi.value}
            </p>
            <p className="text-[#F5F0E8]/60 text-xs font-semibold">{kpi.label}</p>
            <p className="text-[#F5F0E8]/25 text-[10px] mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Prochaine coupe gratuite */}
      <div className="bg-gradient-to-br from-[#1A1000] to-[#0A0A0A] border border-[#C9A84C]/30 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[#C9A84C] font-black text-sm">Prochaine coupe gratuite</p>
          <span className="text-[#C9A84C] font-black">{PROCHAINE_GRATUITE} coupes</span>
        </div>
        <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C9A84C] rounded-full transition-all"
            style={{ width: `${((10 - PROCHAINE_GRATUITE) / 10) * 100}%` }}
          />
        </div>
        <p className="text-[#F5F0E8]/30 text-xs mt-2">
          {10 - PROCHAINE_GRATUITE}/10 coupes réalisées
        </p>
      </div>
    </div>
  );
}

// ─── Jeu : Memory Match ────────────────────────────────────────

const EMOJIS = ["✂️", "💈", "🪒", "👑", "🎵", "⭐", "🏆", "💎"];

function shuffleCards() {
  return [...EMOJIS, ...EMOJIS]
    .sort(() => Math.random() - 0.5);
}

function MemoryGame() {
  const [cards, setCards] = useState<string[]>(() => shuffleCards());
  const [selected, setSelected] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (won) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [won]);

  const handleClick = useCallback(
    (idx: number) => {
      if (locked || selected.includes(idx) || matched.has(idx)) return;

      const newSelected = [...selected, idx];
      setSelected(newSelected);

      if (newSelected.length === 2) {
        const [a, b] = newSelected;
        setMoves((m) => m + 1);
        setLocked(true);

        if (cards[a] === cards[b]) {
          const newMatched = new Set([...matched, a, b]);
          setMatched(newMatched);
          setSelected([]);
          setLocked(false);
          if (newMatched.size === cards.length) setWon(true);
        } else {
          setTimeout(() => {
            setSelected([]);
            setLocked(false);
          }, 900);
        }
      }
    },
    [locked, selected, matched, cards]
  );

  const reset = () => {
    setCards(shuffleCards());
    setSelected([]);
    setMatched(new Set());
    setMoves(0);
    setLocked(false);
    setWon(false);
    setSeconds(0);
  };

  const isRevealed = (idx: number) => selected.includes(idx) || matched.has(idx);

  return (
    <div>
      <div className="flex justify-center gap-5 mb-4 text-sm text-[#F5F0E8]/40">
        <span>🔁 {moves} coups</span>
        <span>⏱ {seconds}s</span>
        <span>✅ {matched.size / 2}/{EMOJIS.length}</span>
      </div>

      {won && (
        <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/40 rounded-xl p-3 mb-4 text-center">
          <p className="text-[#C9A84C] font-black">
            🏆 Gagné en {moves} coups · {seconds}s !
          </p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 max-w-[288px] mx-auto mb-5">
        {cards.map((emoji, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            className={`w-16 h-16 rounded-xl text-2xl flex items-center justify-center transition-all border ${
              matched.has(idx)
                ? "bg-[#C9A84C]/15 border-[#C9A84C]/40 cursor-default"
                : selected.includes(idx)
                ? "bg-[#2A2A2A] border-[#C9A84C]/30"
                : "bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#3A3A3A] cursor-pointer"
            }`}
          >
            {isRevealed(idx) ? (
              emoji
            ) : (
              <span className="text-[#2A2A2A] text-xs font-black">?</span>
            )}
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={reset}
          className="text-xs text-[#C9A84C] border border-[#C9A84C]/30 px-6 py-2 rounded-full hover:bg-[#C9A84C]/10 transition-all"
        >
          Rejouer
        </button>
      </div>
    </div>
  );
}

// ─── Jeu : Barber Rush ─────────────────────────────────────────

function BarberRush() {
  const [active, setActive] = useState(-1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const cellInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdown = useRef<ReturnType<typeof setInterval> | null>(null);
  const scoreRef = useRef(0);

  useEffect(() => {
    setHighScore(Number(localStorage.getItem("renoi-rush-hs") || 0));
  }, []);

  const stop = useCallback(() => {
    if (cellInterval.current) clearInterval(cellInterval.current);
    if (countdown.current) clearInterval(countdown.current);
    setRunning(false);
    setDone(true);
    setActive(-1);
    setHighScore((prev) => {
      const next = Math.max(prev, scoreRef.current);
      localStorage.setItem("renoi-rush-hs", String(next));
      return next;
    });
  }, []);

  const start = () => {
    scoreRef.current = 0;
    setScore(0);
    setTimeLeft(30);
    setRunning(true);
    setDone(false);
    setActive(Math.floor(Math.random() * 9));

    cellInterval.current = setInterval(() => {
      setActive(Math.floor(Math.random() * 9));
    }, 1100);

    countdown.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { stop(); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => () => {
    if (cellInterval.current) clearInterval(cellInterval.current);
    if (countdown.current) clearInterval(countdown.current);
  }, []);

  const handleCell = (idx: number) => {
    if (!running || idx !== active) return;
    scoreRef.current += 1;
    setScore((s) => s + 1);
    setActive(Math.floor(Math.random() * 9));
  };

  return (
    <div className="text-center">
      <div className="flex justify-center gap-5 mb-4 text-sm text-[#F5F0E8]/40">
        <span>
          ✂️ Score :{" "}
          <span className="text-[#C9A84C] font-black">{score}</span>
        </span>
        <span>⏱ {timeLeft}s</span>
        <span>🏆 Meilleur : {highScore}</span>
      </div>

      {done && (
        <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/40 rounded-xl p-3 mb-4">
          <p className="text-[#C9A84C] font-black">
            {score > 0 && score >= highScore
              ? "🏆 Nouveau record !"
              : `Score final : ${score}`}
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 max-w-[216px] mx-auto mb-5">
        {Array.from({ length: 9 }, (_, i) => (
          <button
            key={i}
            onClick={() => handleCell(i)}
            className={`w-16 h-16 rounded-xl text-3xl flex items-center justify-center transition-all border ${
              active === i && running
                ? "bg-[#C9A84C]/20 border-[#C9A84C] scale-105 shadow-lg shadow-[#C9A84C]/20"
                : "bg-[#1A1A1A] border-[#2A2A2A]"
            }`}
          >
            {active === i && running ? "✂️" : ""}
          </button>
        ))}
      </div>

      {!running && (
        <button
          onClick={start}
          className="bg-[#C9A84C] text-[#0A0A0A] font-black px-8 py-2.5 rounded-full hover:bg-[#E2C47A] transition-all text-sm"
        >
          {done ? "Rejouer" : "▶ Démarrer"}
        </button>
      )}

      {!running && !done && (
        <p className="text-[#F5F0E8]/25 text-xs mt-3">
          Tape sur les ciseaux ✂️ le plus vite possible — 30 secondes
        </p>
      )}
    </div>
  );
}

// ─── Jeu : Quiz Barber ─────────────────────────────────────────

const QUIZ = [
  {
    q: "Quel est le slogan de RENOI Barberstreet ?",
    opts: ["La valeur sûre", "Le choix premium", "Style & précision", "L'excellence"],
    a: 0,
  },
  {
    q: "Combien de salons RENOI compte à Ouagadougou ?",
    opts: ["1", "2", "3", "4"],
    a: 1,
  },
  {
    q: "Quels sont les horaires d'ouverture de RENOI ?",
    opts: ["8h–20h", "9h–21h", "8h–19h", "10h–22h"],
    a: 1,
  },
  {
    q: "À combien de coupes obtient-on une coupe gratuite ?",
    opts: ["5", "8", "10", "15"],
    a: 2,
  },
  {
    q: "Dans quel quartier se trouve RENOI ZAD ?",
    opts: ["Pissy", "ZAD", "Dassasgo", "Patte d'Oie"],
    a: 1,
  },
  {
    q: "Quelle est la durée d'un Combo Coupe + Barbe ?",
    opts: ["45 min", "60 min", "75 min", "90 min"],
    a: 2,
  },
  {
    q: "Quelle prestation est labellisée Best-seller ?",
    opts: ["Afro Sculpté", "Coupe Classique", "Combo Coupe + Barbe", "Rasage Traditionnel"],
    a: 2,
  },
  {
    q: "RENOI est ouvert combien de jours par semaine ?",
    opts: ["5", "6", "7", "Seulement en semaine"],
    a: 2,
  },
];

function QuizBarber() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const score = answers.filter((a, i) => a === QUIZ[i].a).length;
  const question = QUIZ[current];

  const handleSelect = (opt: number) => {
    if (selected !== null) return;
    setSelected(opt);
    setTimeout(() => {
      const newAnswers = [...answers, opt];
      setAnswers(newAnswers);
      if (current + 1 < QUIZ.length) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        setDone(true);
      }
    }, 800);
  };

  const reset = () => {
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setDone(false);
  };

  if (done) {
    return (
      <div className="text-center py-4">
        <div className="text-5xl mb-3">
          {score === QUIZ.length ? "🏆" : score >= 6 ? "⭐" : "💈"}
        </div>
        <p className="text-[#F5F0E8] font-black text-2xl mb-1">
          {score}/{QUIZ.length}
        </p>
        <p className="text-[#F5F0E8]/40 text-sm mb-6">
          {score === QUIZ.length
            ? "Parfait ! Tu connais tout sur RENOI !"
            : score >= 6
            ? "Excellent ! Tu es un vrai habitué."
            : score >= 4
            ? "Bien joué ! Tu connais bien le salon."
            : "Continue à venir, tu apprendras ! 😄"}
        </p>
        <button
          onClick={reset}
          className="bg-[#C9A84C] text-[#0A0A0A] font-black px-8 py-2.5 rounded-full hover:bg-[#E2C47A] transition-all text-sm"
        >
          Recommencer
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 text-xs text-[#F5F0E8]/40">
        <span>
          Question {current + 1}/{QUIZ.length}
        </span>
        <span>✅ {score} correctes</span>
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 mb-4">
        <p className="text-[#F5F0E8] font-bold text-sm leading-relaxed">
          {question.q}
        </p>
      </div>

      <div className="space-y-2">
        {question.opts.map((opt, i) => {
          let style =
            "border-[#2A2A2A] text-[#F5F0E8]/70 hover:border-[#C9A84C]/40 hover:text-[#F5F0E8]";
          if (selected !== null) {
            if (i === question.a)
              style = "border-green-500 bg-green-500/10 text-green-400";
            else if (i === selected)
              style = "border-red-500/60 bg-red-500/10 text-red-400";
            else style = "border-[#1A1A1A] text-[#F5F0E8]/20";
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${style}`}
            >
              <span className="font-semibold mr-2 text-[#F5F0E8]/30">
                {["A", "B", "C", "D"][i]}.
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Games Tab ─────────────────────────────────────────────────

const GAMES = [
  {
    id: "memory",
    nom: "Memory Barber",
    desc: "Trouve les paires",
    emoji: "🃏",
    Component: MemoryGame,
  },
  {
    id: "rush",
    nom: "Barber Rush",
    desc: "Tape les ciseaux",
    emoji: "✂️",
    Component: BarberRush,
  },
  {
    id: "quiz",
    nom: "Quiz RENOI",
    desc: "8 questions sur le salon",
    emoji: "🎯",
    Component: QuizBarber,
  },
];

function GamesTab() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const game = GAMES.find((g) => g.id === activeGame);

  if (game) {
    const { Component } = game;
    return (
      <div>
        <button
          onClick={() => setActiveGame(null)}
          className="flex items-center gap-2 text-[#F5F0E8]/40 text-sm mb-6 hover:text-[#C9A84C] transition-colors"
        >
          ← Choisir un autre jeu
        </button>

        <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#2A2A2A]">
            <span className="text-2xl">{game.emoji}</span>
            <div>
              <h3 className="text-[#F5F0E8] font-black">{game.nom}</h3>
              <p className="text-[#F5F0E8]/30 text-xs">{game.desc}</p>
            </div>
          </div>
          <Component />
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[#F5F0E8]/40 text-sm text-center mb-6">
        Choisis un jeu pour patienter pendant ton attente ✂️
      </p>
      <div className="space-y-3">
        {GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveGame(g.id)}
            className="w-full bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5 flex items-center gap-4 hover:border-[#C9A84C]/40 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-2xl shrink-0">
              {g.emoji}
            </div>
            <div className="flex-1">
              <p className="text-[#F5F0E8] font-black">{g.nom}</p>
              <p className="text-[#F5F0E8]/40 text-xs">{g.desc}</p>
            </div>
            <span className="text-[#C9A84C] text-xl group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Page principale ───────────────────────────────────────────

export default function HaircutReplayPage() {
  const [tab, setTab] = useState<"stats" | "jouer">("stats");

  return (
    <main className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3">
            Ton espace fidélité
          </p>
          <h1 className="text-4xl font-black text-[#F5F0E8] mb-2">
            Haircut <span className="text-[#C9A84C]">Replay</span>
          </h1>
          <p className="text-[#F5F0E8]/40 text-sm">
            Tes réductions, tes dépenses — et de quoi passer le temps.
          </p>
        </div>

        {/* Onglets */}
        <div className="flex gap-1 bg-[#111111] border border-[#2A2A2A] rounded-xl p-1 mb-8">
          <button
            onClick={() => setTab("stats")}
            className={`flex-1 py-2.5 text-sm font-black rounded-lg transition-all ${
              tab === "stats"
                ? "bg-[#C9A84C] text-[#0A0A0A]"
                : "text-[#F5F0E8]/40 hover:text-[#F5F0E8]/70"
            }`}
          >
            📊 Mes stats
          </button>
          <button
            onClick={() => setTab("jouer")}
            className={`flex-1 py-2.5 text-sm font-black rounded-lg transition-all ${
              tab === "jouer"
                ? "bg-[#C9A84C] text-[#0A0A0A]"
                : "text-[#F5F0E8]/40 hover:text-[#F5F0E8]/70"
            }`}
          >
            🎮 Jouer
          </button>
        </div>

        {/* Contenu */}
        {tab === "stats" ? <StatsTab /> : <GamesTab />}

        {/* Lien retour */}
        <div className="text-center mt-10">
          <Link
            href="/"
            className="text-[#F5F0E8]/25 text-sm hover:text-[#F5F0E8]/50 transition-colors"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
