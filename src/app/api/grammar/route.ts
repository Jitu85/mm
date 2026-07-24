import { NextResponse } from "next/server"; import { getVolumes } from "@/lib/grammar-data";
export async function GET() {
  return NextResponse.json(getVolumes().map(v => ({ number: v.number, title: v.title, chapters: v.chapters.map(c => ({ volNum: v.number, chNum: c.number, title: c.title })) })));
}
