import React from "react"
import { notFound } from "next/navigation"
import {
  ALL_STORIES,
  CHAPTERS,
  getStoryBySlug,
  getStoryUrlForLang,
  getStoriesByChapter,
  getAdjacentStories,
} from "@/domains/stories/stories.meta"
import { ALL_ENTRIES } from "@/domains/wiki/wiki.data"
import { StoryReaderUI } from "./_components/story-reader-ui"

export function generateStaticParams() {
  return ALL_STORIES.map((s) => ({ slug: s.slug }))
}

async function fetchStoryText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) {
      return null
    }
    return await res.text()
  } catch {
    return null
  }
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = getStoryBySlug(slug)
  if (!story) {
    return notFound()
  }

  // Fetch both language versions in parallel
  const [textJa, textEn] = await Promise.all([
    fetchStoryText(getStoryUrlForLang(story, "ja")),
    fetchStoryText(getStoryUrlForLang(story, "en")),
  ])

  const splitParagraphs = (text: string | null) =>
    text ? text.split(/\n/).filter((p) => p.trim().length > 0) : []

  const paragraphsJa = splitParagraphs(textJa)
  const paragraphsEn = splitParagraphs(textEn)

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
      paragraphsJa={paragraphsJa}
      paragraphsEn={paragraphsEn}
      fetchFailed={textJa === null && textEn === null}
      chapter={chapter}
      chapterStories={chapterStories}
      storyIndex={storyIndex}
      prev={prev ?? null}
      next={next ?? null}
      relatedEntries={relatedEntries}
    />
  )
}
