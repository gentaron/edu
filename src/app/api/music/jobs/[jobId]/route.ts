import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getJobById, getSongById } from "@/domains/music/music.repository";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params;

  const job = await getJobById(jobId);
  if (!job) {
    return NextResponse.json({ error: "ジョブが見つかりません" }, { status: 404 });
  }

  let song = null;
  if (job.songId) {
    song = await getSongById(job.songId);
  }

  return NextResponse.json({ job, song });
}
