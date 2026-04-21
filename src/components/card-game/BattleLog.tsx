"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  log: string[];
};

export default function BattleLog({ log }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [log]);

  return (
    <div className="glass-card rounded-xl p-3 h-28 sm:h-36 overflow-hidden">
      <h4 className="text-[10px] font-bold text-cosmic-muted mb-1.5 tracking-wider uppercase">
        Battle Log
      </h4>
      <div
        ref={scrollRef}
        className="h-[calc(100%-24px)] overflow-y-auto space-y-0.5 pr-1 scrollbar-thin"
      >
        <AnimatePresence initial={false}>
          {log.map((msg, i) => (
            <motion.p
              key={`${msg}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="text-[10px] leading-relaxed"
            >
              <span className="text-cosmic-muted">{msg}</span>
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
