import { getVolumes } from "@/lib/grammar-data";
import ChapterClient from "./ChapterClient";

export function generateStaticParams() {
  const vols = getVolumes();
  const params: { volumeNum: string; chapterNum: string }[] = [];
  vols.forEach((v) => {
    v.chapters.forEach((c) => {
      params.push({
        volumeNum: v.number.toString(),
        chapterNum: c.number.toString(),
      });
    });
  });
  return params;
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ volumeNum: string; chapterNum: string }>;
}) {
  const { volumeNum, chapterNum } = await params;
  return <ChapterClient volumeNum={volumeNum} chapterNum={chapterNum} />;
}
