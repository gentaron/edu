"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Swords, Shuffle, Sparkles, Users } from "lucide-react";
import type { CardDef } from "./_lib/rules";
import Card from "./_components/Card";

const DEMO_CARDS: CardDef[] = [
  { id: "c1", name: "アイリス", type: "character", cost: 5, power: 7, description: "IRIS現代ランキング1位。ブルーワイヤとウォーター・オーブの使い手。トリニティ・アライアンス指導者。", loreRef: "IRIS_1" },
  { id: "c2", name: "ジェン", type: "character", cost: 6, power: 8, description: "Lv938+。Valoria連合圏を主導する現役最強格。", loreRef: "Jenstoryep1" },
  { id: "c3", name: "レイラ・ヴィレル・ノヴァ", type: "character", cost: 4, power: 6, description: "Pink Voltage。AURALIS Collective第二世代。スライム危機で英雄的活躍。", loreRef: "LAYLA" },
  { id: "c4", name: "ケイト・クラウディア", type: "character", cost: 3, power: 4, description: "AURALIS Collective創設者。「光と音を永遠のものに」。", loreRef: "kateclaudiaandlilliesteiner" },
  { id: "c5", name: "アルファ・ケイン", type: "character", cost: 5, power: 7, description: "シャドウ・リベリオンのリーダー。戦士決定戦の元チャンピオン。", loreRef: "nebura" },
  { id: "c6", name: "アヤカ・リン", type: "character", cost: 4, power: 5, description: "Lv.842。搾取生物専門ハンター。マトリカル・リフォーム運動を組織。", loreRef: "sitra" },
  { id: "c7", name: "フィオナ", type: "character", cost: 3, power: 5, description: "ブルーローズ統率者。IRIS現代ランキング2位。", loreRef: "IRIS_1" },
  { id: "c8", name: "ディアナ", type: "character", cost: 3, power: 4, description: "初代Wonder Woman。AURALIS Protoの文化的恩恵をもたらした伝説的人物。", loreRef: "DianaWorld" },
  { id: "e1", name: "スライム危機", type: "event", cost: 3, power: 4, description: "搾取生物の遺伝子変異による大災害。全キャラに4ダメージ。" },
  { id: "e2", name: "セリア黄金期", type: "event", cost: 4, power: 3, description: "フェルミ音楽・nトークン経済の最盛期。手札を3枚引く。" },
  { id: "e3", name: "エルトナ戦争", type: "event", cost: 2, power: 3, description: "大規模軍事衝突。敵キャラ1体に3ダメージ。" },
  { id: "e4", name: "テリアン反乱", type: "event", cost: 1, power: 2, description: "エヴァトロン支配に対する武装抵抗。2ダメージ。" },
  { id: "t1", name: "ブルーワイヤ", type: "tech", cost: 2, power: 3, description: "アイリスの武器。青い光のワイヤーで攻撃。" },
  { id: "t2", name: "ウォーター・オーブ", type: "tech", cost: 3, power: 4, description: "水属性のオーブ。広範囲攻撃が可能。" },
  { id: "t3", name: "ビキニバリア", type: "tech", cost: 1, power: 0, description: "アンダーグリッド深部で使用される防壁。自キャラ1体を強化。" },
  { id: "t4", name: "プラズマカノン", type: "tech", cost: 4, power: 5, description: "高エネルギープラズマを射出する重火器。5ダメージ。" },
  { id: "l1", name: "ギガポリス", type: "location", cost: 3, power: 0, description: "E16最大の都市。味方全キャラの戦力+1。" },
  { id: "l2", name: "Selinopolis", type: "location", cost: 2, power: 0, description: "旧Gigapolis。セリア黄金期の首都。味方全キャラの戦力+1。" },
  { id: "l3", name: "Eros-7", type: "location", cost: 2, power: 0, description: "女性主導のマトリカル社会を持つ外縁惑星。味方+1。" },
  { id: "l4", name: "ヴァーミリオン", type: "location", cost: 3, power: 0, description: "クレセント大地方の国家。アイリスの故郷。味方全キャラ+1。" },
];

export default function GamePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deckName, setDeckName] = useState("EDUデッキ");
  const [mode, setMode] = useState<"select" | "ready">("select");

  const toggleCard = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 10) next.add(id);
      return next;
    });
  };

  const startDemo = () => {
    const ids = Array.from(selected);
    if (ids.length < 3) return;
    const params = new URLSearchParams({ cards: ids.join(",") });
    router.push(`/game/demo?${params.toString()}`);
  };

  const filtered = {
    character: DEMO_CARDS.filter((c) => c.type === "character"),
    event: DEMO_CARDS.filter((c) => c.type === "event"),
    location: DEMO_CARDS.filter((c) => c.type === "location"),
    tech: DEMO_CARDS.filter((c) => c.type === "tech"),
  };

  return (
    <div className="relative min-h-screen bg-cosmic-dark">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-cosmic-border/50">
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-4 h-14">
          <Link href="/" className="text-xs text-cosmic-muted hover:text-electric-blue transition-colors">
            ← EDU
          </Link>
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-nebula-purple" />
            <span className="text-sm font-bold text-cosmic-gradient">EDU Card Game</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-black text-cosmic-gradient mb-3">
              EDU Card Game
            </h1>
            <p className="text-sm text-cosmic-muted max-w-lg mx-auto">
              Eternal Dominion Universe のキャラクター・用語を使ったカードゲーム。
              10枚のカードを選んでデッキを構築し、対戦を開始しましょう。
            </p>
          </div>

          {/* Deck info bar */}
          <div className="glass-card rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-nebula-purple" />
              <span className="text-sm font-bold text-cosmic-text">{deckName}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-cosmic-muted">
                選択: <span className="text-gold-accent font-bold">{selected.size}</span>/10
              </span>
              <button
                onClick={startDemo}
                disabled={selected.size < 3}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-nebula-purple text-white hover:bg-nebula-purple/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Swords className="w-3 h-3 inline mr-1" />
                対戦開始
              </button>
            </div>
          </div>

          {/* Card selection by type */}
          {(["character", "event", "tech", "location"] as const).map((type) => (
            <div key={type} className="mb-8">
              <h2 className="text-sm font-bold text-cosmic-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-nebula-purple" />
                {type === "character" ? "キャラクター" : type === "event" ? "イベント" : type === "tech" ? "テクノロジー" : "ロケーション"}
                <span className="text-cosmic-border">({filtered[type].length})</span>
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {filtered[type].map((card) => (
                  <div key={card.id} onClick={() => toggleCard(card.id)} className="relative">
                    <Card card={card} selected={selected.has(card.id)} />
                    {selected.has(card.id) && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold-accent text-[10px] font-bold text-cosmic-dark flex items-center justify-center">
                        ✓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-cosmic-border/50 py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-cosmic-muted">EDU Card Game — Eternal Dominion Universe</p>
        </div>
      </footer>
    </div>
  );
}
