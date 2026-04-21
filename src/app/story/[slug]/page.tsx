import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Users, Clock } from "lucide-react";
import {
  ALL_STORIES,
  getStoryBySlug,
  getStoryUrl,
  getStoriesForEntry,
} from "@/lib/stories";
import { ALL_ENTRIES } from "@/lib/wiki-data";

export function generateStaticParams() {
  return ALL_STORIES.map((s) => ({ slug: s.slug }));
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function StarField() {
  const stars = React.useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: seededRandom(i * 7 + 1)() * 100,
        top: seededRandom(i * 13 + 3)() * 100,
        size: seededRandom(i * 17 + 5)() * 2 + 0.5,
        delay: seededRandom(i * 23 + 7)() * 5,
        duration: seededRandom(i * 29 + 11)() * 3 + 2,
        opacity: seededRandom(i * 31 + 13)() * 0.5 + 0.2,
      })),
    []
  );
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}

function RelatedStories({
  currentSlug,
  entryIds,
}: {
  currentSlug: string;
  entryIds: string[];
}) {
  const relatedSlugs = new Set<string>();
  entryIds.forEach((eid) => {
    getStoriesForEntry(eid).forEach((s) => {
      if (s.slug !== currentSlug) relatedSlugs.add(s.slug);
    });
  });
  const stories = Array.from(relatedSlugs)
    .map((slug) => getStoryBySlug(slug))
    .filter(Boolean);

  if (stories.length === 0) return null;
  return (
    <div className="mt-10">
      <h3 className="text-sm font-bold text-cosmic-muted uppercase tracking-wider mb-4 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-nebula-purple" />
        関連作品
      </h3>
      <div className="flex flex-col gap-2">
        {stories.map((s) =>
          s ? (
            <Link
              key={s.slug}
              href={`/story/${s.slug}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-nebula-purple/15 bg-nebula-purple/5 text-sm text-nebula-purple/90 hover:bg-nebula-purple/10 hover:border-nebula-purple/30 transition-all duration-200"
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className="truncate">{s.title}</span>
            </Link>
          ) : null
        )}
      </div>
    </div>
  );
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) notFound();

  let text = "";
  try {
    const res = await fetch(getStoryUrl(story.fileName), {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
    text = await res.text();
  } catch {
    text = "この作品は現在読み込みできません。後ほど再度お試しください。";
  }

  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
  const relatedEntries = ALL_ENTRIES.filter((e) =>
    story.relatedEntries.includes(e.id)
  );

  return (
    <div className="relative min-h-screen bg-cosmic-dark">
      <StarField />

      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-cosmic-border/50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-4 h-14">
            {relatedEntries.length > 0 && (
              <Link
                href={`/wiki/${encodeURIComponent(relatedEntries[0].id)}`}
                className="flex items-center gap-2 text-cosmic-muted hover:text-electric-blue transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-xs hidden sm:inline">Wiki</span>
              </Link>
            )}
            <div className="flex items-center gap-2 min-w-0">
              <BookOpen className="w-4 h-4 text-nebula-purple shrink-0" />
              <span className="text-sm font-bold text-cosmic-gradient truncate">
                EDU Story
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Story Header */}
          <header className="mb-12 text-center">
            <div className="w-12 h-0.5 mx-auto bg-gradient-to-r from-transparent via-nebula-purple to-transparent mb-6" />
            <h1 className="text-2xl sm:text-3xl font-black text-cosmic-text mb-3 leading-tight">
              {story.title}
            </h1>
            {story.era && (
              <p className="text-sm text-cosmic-muted flex items-center justify-center gap-1.5 mb-4">
                <Clock className="w-3.5 h-3.5" />
                {story.era}
              </p>
            )}
            {/* Related Characters */}
            <div className="flex flex-wrap justify-center gap-2">
              {relatedEntries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/wiki/${encodeURIComponent(entry.id)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border border-nebula-purple/30 bg-nebula-purple/10 text-nebula-purple hover:bg-nebula-purple/20 transition-colors"
                >
                  <Users className="w-3 h-3" />
                  {entry.name}
                </Link>
              ))}
            </div>
            <div className="w-12 h-0.5 mx-auto bg-gradient-to-r from-transparent via-nebula-purple to-transparent mt-6" />
          </header>

          {/* Story Body */}
          <article className="prose-story">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-sm sm:text-base text-cosmic-text/85 leading-[1.95] mb-5">
                {p.trim()}
              </p>
            ))}
          </article>

          {/* Related Stories */}
          <RelatedStories currentSlug={slug} entryIds={story.relatedEntries} />

          {/* Back to Wiki */}
          <div className="mt-12 text-center">
            {relatedEntries.length > 0 && (
              <Link
                href={`/wiki/${encodeURIComponent(relatedEntries[0].id)}`}
                className="inline-flex items-center gap-2 text-xs text-electric-blue hover:underline transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                「{relatedEntries[0].name}」の百科事典ページに戻る
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-cosmic-border/50 py-8 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-2">
          <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-transparent via-nebula-purple to-transparent" />
          <p className="text-xs text-cosmic-muted">
            EDU Stories — Eternal Dominion Universe
          </p>
          <Link
            href="/wiki"
            className="inline-flex items-center gap-1.5 text-xs text-electric-blue hover:underline transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            EDU 百科事典に戻る
          </Link>
        </div>
      </footer>


    </div>
  );
}
