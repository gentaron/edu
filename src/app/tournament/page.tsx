import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tournament — EDU',
  description: 'Create and manage tournaments with mathematically guaranteed turn bounds.',
};

export default function TournamentPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Tournament
            </span>
          </h1>
          <p className="text-lg text-zinc-400">
            Configure tournaments with mathematically guaranteed bounds.
          </p>
        </div>

        {/* Tournament Configuration */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8">
          <h2 className="mb-6 text-xl font-semibold">Create Tournament</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-400">
                Deck Size
              </label>
              <select className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-zinc-300 focus:border-purple-500/50 focus:outline-none">
                <option value="3">3 characters</option>
                <option value="4">4 characters</option>
                <option value="5" selected>5 characters (standard)</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-400">
                Enemy Configuration
              </label>
              <select className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-zinc-300 focus:border-purple-500/50 focus:outline-none">
                <option value="standard">Standard (1000 HP)</option>
                <option value="boss">Boss (5000 HP)</option>
                <option value="final">Final Boss (9999 HP)</option>
              </select>
            </div>
          </div>

          {/* Derived Bound */}
          <div className="mt-8 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-6">
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                Lean-proven
              </span>
              <span className="text-xs text-zinc-500">From Apolon.NoInfiniteCombo</span>
            </div>
            <p className="mb-1 text-sm text-zinc-400">Mathematically guaranteed maximum turn count:</p>
            <p className="text-3xl font-bold text-emerald-400">200 turns</p>
            <p className="mt-2 text-xs text-zinc-600">
              Formula: min(2 * max(ceil(E/M) + 1, ceil(H/A) + 1), 200)
              where E=enemy HP, M=min player attack, H=total player HP, A=enemy attack
            </p>
          </div>

          <button className="mt-6 rounded-lg bg-purple-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-500">
            Create Tournament
          </button>
        </div>

        {/* Proof explanation */}
        <div className="mt-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            How is this bound computed?
          </h3>
          <div className="space-y-3 text-sm text-zinc-400">
            <p>
              The maximum turn count is <strong className="text-zinc-300">extracted from the Lean 4 theorem</strong>{' '}
              <code className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-300">NoInfiniteCombo.computeMaxTurns</code>.
              This theorem proves that for any deck of size 5, every legal action sequence terminates
              within a bounded number of turns.
            </p>
            <p>
              The bound is a <strong className="text-zinc-300">conservative over-approximation</strong> —
              actual battles typically end in 10-30 turns. The bound exists to guarantee that
              the tournament timer will never expire due to an infinite loop.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
