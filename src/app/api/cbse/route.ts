import { NextRequest, NextResponse } from "next/server";
import { getModuleCNotes, getModuleCMCQs, getModuleCMeta } from "@/lib/module-c-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // "meta", "notes", "mcq"
  const subject = searchParams.get("subject") || undefined;
  const dataset = (searchParams.get("dataset") as "sample" | "board" | "all") || "all";
  const series = searchParams.get("series") || undefined;
  const limitParam = searchParams.get("limit");
  const shuffleParam = searchParams.get("shuffle");

  if (type === "meta") {
    const meta = getModuleCMeta();
    return NextResponse.json(meta);
  }

  if (type === "notes") {
    const notes = getModuleCNotes(subject);
    return NextResponse.json({ count: notes.length, notes });
  }

  const limit = limitParam ? parseInt(limitParam, 10) : undefined;
  const shuffle = shuffleParam === "true";

  const mcqs = getModuleCMCQs({
    subject,
    dataset,
    series,
    limit,
    shuffle,
  });

  return NextResponse.json({
    count: mcqs.length,
    mcqs,
  });
}
