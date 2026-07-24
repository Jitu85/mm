import { NextResponse } from "next/server"; import { getChapter } from "@/lib/grammar-data";
export async function GET(_req: Request, { params }: { params: Promise<{ volumeNum: string; chapterNum: string }> }) {
  const { volumeNum, chapterNum } = await params;
  const r = getChapter(parseInt(volumeNum), parseInt(chapterNum));
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(r.chapter);
}
