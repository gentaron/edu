"use client";

import { useState, useMemo } from "react";
import { Search, Users, Crown, Star, Sparkles, Scroll, BookOpen, ChevronRight, ArrowLeft } from "lucide-react";
import { ALL_ENTRIES } from "@/domains/wiki/wiki.data";
import { type Lang, tl, tlTier } from "@/lib/lang";
import { LangToggle } from "@/lib/lang-toggle";
import { useLang } from "@/lib/use-lang";

type Category = "キャラクター" | "用語" | "組織" | "地理" | "技術" | "歴史";

const CATEGORIES: { key: Category; label: string; labelEn: string; icon: typeof Users; color: string }[] = [
  { key: "キャラクター", label: "キャラクター", labelEn: "Characters", icon: Users, color: "text-amber-400" },
  { key: "組織", label: "組織", labelEn: "Organizations", icon: Crown, color: "text-indigo-400" },
  { key: "地理", label: "地理", labelEn: "Geography", icon: Star, color: "text-emerald-400" },
  { key: "技術", label: "技術", labelEn: "Technology", icon: Sparkles, color: "text-cyan-400" },
  { key: "用語", label: "用語", labelEn: "Terms", icon: BookOpen, color: "text-pink-400" },
  { key: "歴史", label: "歴史", labelEn: "History", icon: Scroll, color: "text-orange-400" },
];

const BORDER_COLORS: Record<Category, string> = {
  キャラクター: "border-l-amber-400",
  組織: "border-l-indigo-400",
  地理: "border-l-emerald-400",
  技術: "border-l-cyan-400",
  用語: "border-l-pink-400",
  歴史: "border-l-orange-400",
};

export default function WikiView({ lang: langProp, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [search, setSearch] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const isSearching = search.trim().length > 0;
  const showCategory = !isSearching && selectedCategory;

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    const q = search.toLowerCase().trim();
    return ALL_ENTRIES.filter(
      (e) => e.name.toLowerCase().includes(q) || (e.nameEn && e.nameEn.toLowerCase().includes(q)) || e.description.toLowerCase().includes(q) || (e.descriptionEn && e.descriptionEn.toLowerCase().includes(q))
    );
  }, [search, isSearching]);

  const categoryEntries = useMemo(() => {
    if (!showCategory || !selectedCategory) return [];
    return ALL_ENTRIES.filter((e) => e.category === selectedCategory);
  }, [showCategory, selectedCategory]);

  const grouped = useMemo(() => {
    const map: Partial<Record<Category, typeof ALL_ENTRIES>> = {};
    for (const cat of CATEGORIES.map((c) => c.key)) {
      map[cat] = ALL_ENTRIES.filter((e) => e.category === cat);
    }
    return map;
  }, []);

  const activeEntry = selectedEntry ? ALL_ENTRIES.find((e) => e.id === selectedEntry) : null;
  const activeCategoryConfig = selectedCategory ? CATEGORIES.find((c) => c.key === selectedCategory) : null;

  if (activeEntry) {
    return (
      <div className="min-h-screen bg-[#08080d] text-white">
        <div className="max-w-3xl mx-auto px-6 pt-20 pb-16">
          <button onClick={() => setSelectedEntry(null)} className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mb-8">
            <ArrowLeft className="w-3 h-3" /> {tl("Wikiに戻る", "Back to Wiki", langProp)}
          </button>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white/90">{langProp === "en" && activeEntry.nameEn ? activeEntry.nameEn : activeEntry.name}</h1>
              {activeEntry.nameEn && langProp !== "en" && <p className="text-sm text-white/40">{activeEntry.nameEn}</p>}
            </div>
            <LangToggle lang={langProp} setLang={setLang} />
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-2.5 py-1 rounded-full border border-white/10 text-xs text-white/60">{activeEntry.category}</span>
            {activeEntry.subCategory && <span className="px-2.5 py-1 rounded-full border border-white/10 text-xs text-white/60">{activeEntry.subCategory}</span>}
            {activeEntry.tier && <span className="px-2.5 py-1 rounded-full border border-amber-500/30 text-xs text-amber-400">{tlTier(activeEntry.tier, langProp)}</span>}
            {activeEntry.era && <span className="px-2.5 py-1 rounded-full border border-white/10 text-xs text-white/60">{activeEntry.era}</span>}
          </div>

          {(activeEntry.era || activeEntry.affiliation) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {activeEntry.era && (
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-lg">
                  <p className="text-[10px] text-white/30 mb-1.5 uppercase tracking-widest">{tl("時代", "Era", langProp)}</p>
                  <p className="text-sm text-white/80">{activeEntry.era}</p>
                </div>
              )}
              {activeEntry.affiliation && (
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-lg">
                  <p className="text-[10px] text-white/30 mb-1.5 uppercase tracking-widest">{tl("所属", "Affiliation", langProp)}</p>
                  <p className="text-sm text-white/80">{activeEntry.affiliation}</p>
                </div>
              )}
            </div>
          )}

          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-lg mb-8">
            <h2 className="text-[11px] text-white/30 mb-5 uppercase tracking-widest flex items-center gap-2">
              <Scroll className="w-3.5 h-3.5 text-red-400/60" /> {tl("概要", "Overview", langProp)}
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              {langProp === "en" && activeEntry.descriptionEn ? activeEntry.descriptionEn : activeEntry.description}
            </p>
          </div>

          {activeEntry.sourceLinks && activeEntry.sourceLinks.length > 0 && (
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-lg mb-8">
              <h2 className="text-[11px] text-white/30 mb-5 uppercase tracking-widest">{tl("参照リンク", "Source Links", langProp)}</h2>
              <div className="space-y-2">
                {activeEntry.sourceLinks.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 rounded-lg border border-white/5 bg-white/[0.01] text-sm text-white/60 hover:text-white/80 hover:bg-white/[0.03] transition-all">
                    <BookOpen className="w-4 h-4 shrink-0 text-white/30" />
                    <span className="truncate">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between py-8 border-t border-white/5">
            <button onClick={() => setSelectedEntry(null)} className="text-xs text-white/30 hover:text-white/60 transition-colors">← {tl("戻る", "Back", langProp)}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080d] text-white pt-16 pb-20">
      <div className="max-w-3xl mx-auto px-6 pt-8 pb-6">
        <div className="flex items-center justify-between gap-4 mb-1">
          <h1 className="text-xl font-bold text-white/90">{tl("EDU Wiki 百科事典", "EDU Wiki Encyclopedia", langProp)}</h1>
          <LangToggle lang={langProp} setLang={setLang} />
        </div>
        <p className="text-xs text-white/30 mb-6">
          {ALL_ENTRIES.length} {tl("件", "entries", langProp)}
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSelectedCategory(null); }}
            placeholder={tl("Wiki内を検索...", "Search wiki...", langProp)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white/80 placeholder:text-white/30 focus:outline-none focus:border-red-400/50"
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {isSearching ? (
          <div>
            <p className="text-xs text-white/30 mb-4">{searchResults.length} {tl("件", " entries", langProp)}</p>
            {searchResults.length === 0 ? (
              <p className="text-xs text-white/30 text-center py-12">{tl("該当するエントリがありません", "No matching entries found", langProp)}</p>
            ) : (
              <div className="space-y-2">
                {searchResults.map((entry) => (
                  <button key={entry.id} onClick={() => setSelectedEntry(entry.id)} className={`block w-full text-left p-3 border-l-[3px] ${BORDER_COLORS[entry.category] || "border-l-white/10"} bg-white/[0.01] hover:bg-white/[0.03] border border-r border-b border-t border-white/5 hover:border-red-400/30 transition-colors`}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-white/80">{langProp === "en" && entry.nameEn ? entry.nameEn : entry.name}</span>
                      {entry.nameEn && langProp !== "en" && <span className="text-[10px] text-white/30">{entry.nameEn}</span>}
                    </div>
                    <p className="text-[11px] text-white/30 leading-relaxed line-clamp-2">{(langProp === "en" && entry.descriptionEn ? entry.descriptionEn : entry.description).slice(0, 100)}…</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : showCategory && activeCategoryConfig ? (
          <div>
            <button onClick={() => setSelectedCategory(null)} className="inline-flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors mb-4">
              <ChevronRight className="w-3 h-3 rotate-180" /> {tl("カテゴリ一覧に戻る", "Back to categories", langProp)}
            </button>
            <div className="flex items-center gap-2 mb-6">
              <activeCategoryConfig.icon className={`w-4 h-4 ${activeCategoryConfig.color}`} />
              <h2 className="text-sm font-bold text-white/80">{langProp === "en" ? activeCategoryConfig.labelEn : activeCategoryConfig.label}</h2>
              <span className="text-[10px] text-white/30">{categoryEntries.length} {tl("件", " entries", langProp)}</span>
            </div>
            <div className="space-y-2">
              {categoryEntries.map((entry) => (
                <button key={entry.id} onClick={() => setSelectedEntry(entry.id)} className={`block w-full text-left p-3 border-l-[3px] ${BORDER_COLORS[entry.category] || "border-l-white/10"} bg-white/[0.01] hover:bg-white/[0.03] border border-r border-b border-t border-white/5 hover:border-red-400/30 transition-colors`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium text-white/80">{langProp === "en" && entry.nameEn ? entry.nameEn : entry.name}</span>
                    {entry.nameEn && langProp !== "en" && <span className="text-[10px] text-white/30">{entry.nameEn}</span>}
                    {entry.tier && <span className="text-[10px] text-white/30 bg-white/[0.03] px-1.5 py-0.5 rounded">{tlTier(entry.tier, langProp)}</span>}
                  </div>
                  <p className="text-[11px] text-white/30 leading-relaxed line-clamp-2">{(langProp === "en" && entry.descriptionEn ? entry.descriptionEn : entry.description).slice(0, 100)}…</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {CATEGORIES.map((cat) => {
              const entries = grouped[cat.key] || [];
              if (entries.length === 0) return null;
              const representatives = entries.slice(0, 8);
              const Icon = cat.icon;
              return (
                <section key={cat.key} className="p-5 bg-white/[0.02] border border-white/5 rounded-xl">
                  <button onClick={() => setSelectedCategory(cat.key)} className="w-full text-left">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${cat.color}`} />
                        <h2 className="text-sm font-bold text-white/80">{langProp === "en" ? cat.labelEn : cat.label}</h2>
                        <span className="text-[10px] text-white/30">{entries.length}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20" />
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {representatives.map((entry) => (
                        <span key={entry.id} className="text-xs text-red-400/70 hover:text-red-300 transition-colors">{langProp === "en" && entry.nameEn ? entry.nameEn : entry.name}</span>
                      ))}
                      <span className="text-xs text-white/20">...</span>
                    </div>
                  </button>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
