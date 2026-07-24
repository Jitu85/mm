import { NextRequest, NextResponse } from "next/server";
import { getFilteredQAItems, getQASubjects, getAllQAItems } from "@/lib/qa-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get("subject") || undefined;
  const series = searchParams.get("series") || undefined;
  const limitParam = searchParams.get("limit");
  const shuffleParam = searchParams.get("shuffle");
  const metaOnly = searchParams.get("metaOnly");

  if (metaOnly === "true") {
    const subjects = getQASubjects();
    const totalQuestions = getAllQAItems().length;
    return NextResponse.json({ subjects, totalQuestions });
  }

  const limit = limitParam ? parseInt(limitParam, 10) : undefined;
  const shuffle = shuffleParam === "true";

  const questions = getFilteredQAItems({ subject, series, limit, shuffle });

  return NextResponse.json({
    count: questions.length,
    questions,
  });
}
