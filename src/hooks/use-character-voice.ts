"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export interface CharacterVoiceConfig {
  pitch: number; // 0.5 - 2.0
  rate: number; // 0.5 - 2.0
  volume: number; // 0.0 - 1.0
  lang: string;
}

/** Character voice configurations */
export const CHARACTER_VOICES: Record<string, CharacterVoiceConfig> = {
  auralis: { pitch: 0.9, rate: 0.95, volume: 0.8, lang: "ja-JP" },
  mina: { pitch: 1.3, rate: 1.05, volume: 0.7, lang: "ja-JP" },
  iris: { pitch: 1.1, rate: 0.98, volume: 0.85, lang: "ja-JP" },
  diana: { pitch: 0.8, rate: 0.9, volume: 0.75, lang: "ja-JP" },
  layla: { pitch: 1.2, rate: 1.0, volume: 0.8, lang: "ja-JP" },
  jen: { pitch: 1.4, rate: 1.1, volume: 0.7, lang: "en-US" },
  gentaro: { pitch: 0.7, rate: 0.85, volume: 0.9, lang: "ja-JP" },
  default: { pitch: 1.0, rate: 1.0, volume: 0.8, lang: "ja-JP" },
};

export type VoiceState = "idle" | "playing" | "paused";

export function useCharacterVoice(characterId: string) {
  const [state, setState] = useState<VoiceState>("idle");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const DEFAULT_VOICE: CharacterVoiceConfig = {
    pitch: 1.0,
    rate: 1.0,
    volume: 0.8,
    lang: "ja-JP",
  };
  const config = CHARACTER_VOICES[characterId] ?? DEFAULT_VOICE;

  const speak = useCallback(
    (text: string) => {
      if (!("speechSynthesis" in window)) {
        console.warn("Web Speech API not supported");
        return;
      }

      // Cancel any current speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = config.pitch;
      utterance.rate = config.rate;
      utterance.volume = config.volume;
      utterance.lang = config.lang;

      utterance.onstart = () => {
        setState("playing");
      };

      utterance.onend = () => {
        setState("idle");
      };

      utterance.onpause = () => {
        setState("paused");
      };

      utterance.onresume = () => {
        setState("playing");
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [config]
  );

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setState("idle");
  }, []);

  // Stop speech on page navigation
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return { state, speak, pause, resume, stop };
}
