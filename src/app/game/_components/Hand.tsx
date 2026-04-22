// @ts-nocheck — legacy game component
"use client"

import React from "react"
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core"
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Card from "./Card"
import type { CardDef } from "../_lib/rules"

interface SortableCardProps {
  card: CardDef
  index: number
  canPlay?: boolean
  onClick?: () => void
}

function SortableCard({ card, index, canPlay, onClick }: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    index,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 0,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card card={card} canPlay={canPlay} onClick={onClick} />
    </div>
  )
}

interface HandProps {
  cards: CardDef[]
  playableIndices?: Set<number>
  onCardClick?: (index: number) => void
  onCardDrop?: (card: CardDef, index: number) => void
  label?: string
}

export default function Hand({
  cards,
  playableIndices,
  onCardClick,
  onCardDrop,
  label,
}: HandProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && onCardDrop) {
      const card = cards.find((c) => c.id === active.id)
      const idx = cards.findIndex((c) => c.id === active.id)
      if (card && idx >= 0) onCardDrop(card, idx)
    }
  }

  return (
    <div className="glass-card rounded-xl p-3">
      {label && (
        <p className="text-[10px] text-cosmic-muted uppercase tracking-wider font-bold mb-2">
          {label} ({cards.length})
        </p>
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={cards.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
          <div className="flex gap-2 overflow-x-auto pb-2 min-h-[144px] items-end">
            {cards.map((card, i) => (
              <SortableCard
                key={card.id}
                card={card}
                index={i}
                canPlay={playableIndices?.has(i)}
                onClick={() => onCardClick?.(i)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
