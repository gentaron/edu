import React from "react"
import { notFound } from "next/navigation"
import {
  ALL_STORIES,
  CHAPTERS,
  getStoryBySlug,
  getStoryUrl,
  getStoriesByChapter,
  getAdjacentStories,
} from "@/lib/stories"
import { ALL_ENTRIES } from "@/lib/wiki-data"
import { StoryReaderUI } from "./_components/story-reader-ui"

export function generateStaticParams() {
  return ALL_STORIES.map((s) => ({ slug: s.slug }))
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = getStoryBySlug(slug)
  if (!story) return notFound()

  let text: string | null = null
  try {
    const res = await fetch(getStoryUrl(story.fileName), { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`)
    text = await res.text()
  } catch {
    text = null
  }

  const paragraphs = text ? text.split(/\n\n+/).filter((p) => p.trim().length > 0) : []
  const relatedEntries = ALL_ENTRIES.filter((e) => story.relatedEntries.includes(e.id)).map(
    (e) => ({ id: e.id, name: e.name })
  )
  const chapter = CHAPTERS.find((ch) => ch.id === story.chapter)
  const chapterStories = getStoriesByChapter(story.chapter)
  const { prev, next } = getAdjacentStories(story)
  const storyIndex = chapterStories.findIndex((s) => s.slug === story.slug)

  return (
    <StoryReaderUI
      story={story}
      paragraphs={paragraphs}
      fetchFailed={text === null}
      chapter={chapter}
      chapterStories={chapterStories}
      storyIndex={storyIndex}
      prev={prev ?? null}
      next={next ?? null}
      relatedEntries={relatedEntries}
    />
  )
}
