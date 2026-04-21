"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import PlayerCard from "./PlayerCard";
import type { CardData } from "@/lib/game-engine";

type Props = {
  field: CardData[];
  onCardClick?: (cardId: string) => void;
};

export default function FieldZone({ field, onCardClick }: Props) {
  const { isOver, setNodeRef } = useDroppable({ id: "field-zone" });

  return (
    <div className="min-h-[120px] sm:min-h-[140px]">
      <div
        ref={setNodeRef}
        className={`min-h-[120px] sm:min-h-[140px] rounded-xl border-2 border-dashed transition-colors p-3 flex flex-wrap items-center justify-center gap-2 ${
          isOver
            ? "border-electric-blue/60 bg-electric-blue/5"
            : "border-cosmic-border/30 bg-cosmic-dark/30"
        }`}
      >
        {field.length === 0 ? (
          <p className="text-[10px] text-cosmic-muted/50 select-none">
            カードをここにドロップ
          </p>
        ) : (
          field.map((card) => (
            <motion.div
              key={card.id}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <PlayerCard card={card} variant="field" />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
