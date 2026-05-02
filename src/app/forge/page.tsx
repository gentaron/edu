import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Forge — EDU Card Laboratory',
  description: 'Create, verify, and publish custom Apolon cards. Verified by Lean 4 typechecker.',
};

export default function ForgePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              The Forge
            </span>
          </h1>
          <p className="text-lg text-zinc-400">
            Create custom cards powered by the Apolon DSL.
            Every submission is verified by the Lean 4 typechecker —
            the same proof engine that guards the core battle system.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Editor Card */}
          <Link
            href="/forge/editor"
            className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 transition-all hover:border-amber-500/50 hover:bg-zinc-900"
          >
            <div className="mb-4 text-3xl">&#x2694;</div>
            <h2 className="mb-2 text-xl font-semibold text-zinc-100 group-hover:text-amber-400">
              Card Editor
            </h2>
            <p className="text-sm text-zinc-400">
              Write Apolon DSL code in the browser editor. Submit for typechecking
              and deploy to the gallery on success.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                Lean 4 Verified
              </span>
              <span className="text-xs text-zinc-500">Type-safe</span>
            </div>
          </Link>

          {/* Gallery Card */}
          <Link
            href="/forge/gallery"
            className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 transition-all hover:border-amber-500/50 hover:bg-zinc-900"
          >
            <div className="mb-4 text-3xl">&#x1F3AD;</div>
            <h2 className="mb-2 text-xl font-semibold text-zinc-100 group-hover:text-amber-400">
              Card Gallery
            </h2>
            <p className="text-sm text-zinc-400">
              Browse community-created cards. Only verified cards that passed
              the Lean typechecker are displayed here.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                Community
              </span>
            </div>
          </Link>
        </div>

        {/* Verification Status */}
        <div className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Verification Pipeline
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs text-emerald-400">
                1
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-300">Apolon Parse</p>
                <p className="text-xs text-zinc-500">Tree-sitter grammar validates syntax</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs text-amber-400">
                2
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-300">Lean 4 Typecheck</p>
                <p className="text-xs text-zinc-500">Same typechecker as canonical cards</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400">
                3
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-300">Balance Verify</p>
                <p className="text-xs text-zinc-500">No-infinite-combo theorem check</p>
              </div>
            </div>
          </div>
        </div>

        {/* Proof Integration Notice */}
        <div className="mt-8 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-xs text-amber-400/80">
            <strong>Engine Theorems Mechanized in Lean 4</strong> — The Forge uses the same
            verified typechecker that guards all canonical cards. There is no separate
            &quot;safety layer&quot; for UGC — theorems proven in Lean 4 apply uniformly.
            See <code className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-300">proofs/lean/Apolon/</code>.
          </p>
        </div>
      </div>
    </main>
  );
}
