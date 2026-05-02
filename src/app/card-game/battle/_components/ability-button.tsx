"use client"

import React from "react"
import { m } from "framer-motion"

export function AbilityButton({
  label,
  icon,
  value,
  subLabel,
  color,
  glowColor,
  onClick,
  disabled,
}: {
  label: string
  icon: React.ReactNode
  value: string
  subLabel?: string
  color: string
  glowColor: string
  onClick: () => void
  disabled: boolean
}) {
  return (
    <m.button
      whileHover={disabled ? {} : { scale: 1.06, y: -3 }}
      whileTap={disabled ? {} : { scale: 0.94 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative flex-1 rounded-xl border backdrop-blur-sm p-2 sm:p-3 transition-all duration-300 flex flex-col items-center gap-1 sm:gap-1.5 overflow-hidden min-h-[56px] sm:min-h-0 ${
        disabled
          ? "opacity-25 cursor-not-allowed border-edu-border/20 bg-edu-bg/30"
          : `cursor-pointer hover:shadow-xl border-opacity-50 ${color}`
      }`}
    >
      {!disabled && (
        <m.div
          className={`absolute inset-0 rounded-xl bg-gradient-to-br ${glowColor}`}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.2 }}
          transition={{ duration: 0.3 }}
        />
      )}
      {icon}
      <span className="text-[10px] sm:text-xs font-bold text-edu-text relative z-10">{label}</span>
      <span className="text-[8px] sm:text-[10px] font-bold text-edu-muted relative z-10">
        {value}
      </span>
      {subLabel && (
        <span className="text-[7px] sm:text-[8px] text-edu-muted/70 leading-tight text-center line-clamp-2 max-w-full relative z-10">
          {subLabel}
        </span>
      )}
    </m.button>
  )
}
