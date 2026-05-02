import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forge Gallery — Community Cards',
  description: 'Browse community-created cards verified by the Lean 4 typechecker.',
};

// Placeholder data for gallery
const COMMUNITY_CARDS = [
  {
    id: 'ugc-001',
    name: 'Ember Sentinel',
    rarity: 'R',
    author: 'PlayerAlpha',
    proofHash: 'sha256:a1b2c3...',
    verifiedAt: '2026-04-28',
    usesInRanked: 42,
  },
  {
    id: 'ugc-002',
    name: 'Frost Weaver',
    rarity: 'SR',
    author: 'DimensionWalker',
    proofHash: 'sha256:d4e5f6...',
    verifiedAt: '2026-04-30',
    usesInRanked: 128,
  },
  {
    id: 'ugc-003',
    name: 'Void Pulse',
    rarity: 'R',
    author: 'ResonanceAce',
    proofHash: 'sha256:g7h8i9...',
    verifiedAt: '2026-05-01',
    usesInRanked: 15,
  },
];

export default function ForgeGalleryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Card Gallery
            </span>
          </h1>
          <p className="text-lg text-zinc-400">
            Community-created cards verified by Lean 4. Only cards that pass the
            full verification pipeline appear here.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COMMUNITY_CARDS.map((card) => (
            <div
              key={card.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-blue-500/30"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  card.rarity === 'SR' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {card.rarity}
                </span>
                <span className="text-xs text-zinc-600">{card.verifiedAt}</span>
              </div>
              <h3 className="mb-1 text-lg font-semibold text-zinc-100">{card.name}</h3>
              <p className="mb-4 text-sm text-zinc-500">by {card.author}</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Uses in Ranked</span>
                  <span className="text-zinc-300">{card.usesInRanked}</span>
                </div>
                <div className="truncate rounded bg-zinc-950 px-2 py-1 font-mono text-zinc-600">
                  {card.proofHash}
                </div>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
                  Lean-proven
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-500">
            No cards yet? Create one in the{' '}
            <a href="/forge/editor" className="text-amber-400 hover:text-amber-300">
              Card Editor
            </a>.
          </p>
        </div>
      </div>
    </main>
  );
}
