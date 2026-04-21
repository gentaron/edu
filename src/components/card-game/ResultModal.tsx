"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  result: "victory" | "defeat" | null;
  enemyName: string;
  reward?: string;
  onRestart: () => void;
  onBack: () => void;
};

export default function ResultModal({ result, enemyName, reward, onRestart, onBack }: Props) {
  if (!result) return null;

  const isVictory = result === "victory";

  return (
    <AnimatePresence>
      {result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-cosmic-dark/80 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className={`glass-card rounded-2xl p-8 max-w-md w-full text-center border-2 ${
              isVictory
                ? "border-gold-accent/50 shadow-lg shadow-gold-accent/10"
                : "border-rose-500/50 shadow-lg shadow-rose-500/10"
            }`}
          >
            {/* Icon */}
            <motion.div
              animate={{ rotate: isVictory ? [0, 10, -10, 0] : 0 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-5xl mb-4"
            >
              {isVictory ? "🏆" : "💀"}
            </motion.div>

            {/* Title */}
            <h2
              className={`text-2xl font-black mb-2 ${
                isVictory ? "text-gold-accent" : "text-rose-400"
              }`}
            >
              {isVictory ? "VICTORY" : "DEFEAT"}
            </h2>

            <p className="text-sm text-cosmic-muted mb-4">
              {isVictory
                ? `${enemyName} を撃破した！`
                : `${enemyName} に敗北した...`}
            </p>

            {isVictory && reward && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-cosmic-dark/50 rounded-lg p-3 mb-6 border border-gold-accent/20"
              >
                <p className="text-[11px] text-gold-accent/80 italic">{reward}</p>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={onRestart}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-electric-blue/20 text-electric-blue border border-electric-blue/30 hover:bg-electric-blue/30 transition-colors"
              >
                もう一度戦う
              </button>
              <button
                onClick={onBack}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-cosmic-surface text-cosmic-muted border border-cosmic-border/50 hover:bg-cosmic-surface/80 transition-colors"
              >
                エネミー選択へ
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
