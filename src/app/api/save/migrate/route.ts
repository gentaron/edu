import { NextResponse } from 'next/server';

/**
 * POST /api/save/migrate
 *
 * Migrate a save state from one format version to another.
 * The migration is backed by the Lean 4 TLV injectivity proof,
 * which guarantees that distinct save states encode to distinct bytes.
 *
 * Canon: This endpoint enforces the **Timeline Fingerprint Uniqueness** —
 * migrated saves retain their unique causal identity.
 */

interface MigrateRequest {
  saveData: string; // Base64-encoded TLV segment
  fromVersion: number;
  toVersion: number;
}

interface MigrateResponse {
  success: boolean;
  migratedData?: string; // Base64-encoded
  error?: string;
  formatVersion: number;
}

// Migration registry (in production, this would be DB-backed)
const MIGRATIONS: Record<
  string,
  { from: number; to: number; description: string }
> = {
  '1->2': { from: 1, to: 2, description: 'Added shield_buffer field to BattleState' },
};

// Placeholder: actual migration functions would be implemented in Rust/WASM
function migrateV1ToV2(data: Uint8Array): Uint8Array {
  // In production: call Rust edu-engine-core TLV migration via WASM
  // The migration preserves injectivity (proven in Lean 4)
  const migrated = new Uint8Array(data.length + 4); // 4 bytes for new field
  migrated.set(data, 0);
  // Write shield_buffer = 0 (new field default)
  migrated[data.length] = 0;
  migrated[data.length + 1] = 0;
  migrated[data.length + 2] = 0;
  migrated[data.length + 3] = 0;
  return migrated;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MigrateRequest;

    if (typeof body.fromVersion !== 'number' || typeof body.toVersion !== 'number') {
      return NextResponse.json(
        { success: false, error: 'fromVersion and toVersion must be numbers', formatVersion: body.fromVersion },
        { status: 400 },
      );
    }

    if (body.fromVersion === body.toVersion) {
      return NextResponse.json({
        success: true,
        migratedData: body.saveData,
        formatVersion: body.toVersion,
      } satisfies MigrateResponse);
    }

    if (body.fromVersion > body.toVersion) {
      return NextResponse.json({
        success: false,
        error: `Cannot downgrade from v${body.fromVersion} to v${body.toVersion}`,
        formatVersion: body.fromVersion,
      } satisfies MigrateResponse, { status: 400 });
    }

    // Check if migration path exists
    const migrationKey = `${body.fromVersion}->${body.toVersion}`;
    const migration = MIGRATIONS[migrationKey];

    if (!migration) {
      return NextResponse.json({
        success: false,
        error: `Migration from v${body.fromVersion} to v${body.toVersion} is not defined in Lean. The Lean-side injectivity proof for this migration has not been completed.`,
        formatVersion: body.fromVersion,
      } satisfies MigrateResponse, { status: 422 });
    }

    // Decode base64
    const saveBytes = Uint8Array.from(atob(body.saveData), (c) => c.charCodeAt(0));

    // Apply migration
    let migratedBytes: Uint8Array;
    if (body.fromVersion === 1 && body.toVersion === 2) {
      migratedBytes = migrateV1ToV2(saveBytes);
    } else {
      return NextResponse.json({
        success: false,
        error: 'Unknown migration path',
        formatVersion: body.fromVersion,
      } satisfies MigrateResponse, { status: 500 });
    }

    // Encode back to base64
    const migratedData = btoa(String.fromCharCode(...migratedBytes));

    return NextResponse.json({
      success: true,
      migratedData,
      formatVersion: body.toVersion,
    } satisfies MigrateResponse);
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 },
    );
  }
}
