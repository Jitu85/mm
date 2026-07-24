import { readFileSync, existsSync } from "fs"; import path from "path";
export interface GrammarItem { id: string; text: string; answer: string | null; }
export interface GrammarSubgroup { instruction: string; items: GrammarItem[]; }
export interface GrammarExercise { id: string; exercise_number: number; subgroups: GrammarSubgroup[]; }
export interface GrammarChapterBody { type: string; plain?: string; html?: string; is_list?: boolean; rows?: string[][]; }
export interface GrammarChapter { number: number; title: string; body: GrammarChapterBody[]; exercises: GrammarExercise[]; }
export interface GrammarVolume { id: string; number: number; title: string; chapters: GrammarChapter[]; }
const dd = path.join(process.cwd(), "extracted_data");
const meta = [
  { file: "Modern English Grammar - I.json", number: 1, title: "Modern English Grammar & Composition \u2013 I" },
  { file: "Modern English Grammar - II.json", number: 2, title: "Modern English Grammar & Composition \u2013 II" },
  { file: "Modern English Grammar - III.json", number: 3, title: "Modern English Grammar & Composition \u2013 III" },
];
function load(m: typeof meta[0]): GrammarVolume {
  const fp = path.join(dd, m.file);
  if (!existsSync(fp)) return { id: `vol-${m.number}`, number: m.number, title: m.title, chapters: [] };
  const raw: any[] = JSON.parse(readFileSync(fp, "utf-8"));
  const chapters: GrammarChapter[] = raw.map((ch: any) => {
    const answers: Record<string, string[]> = ch.answers || {};
    const exercises: GrammarExercise[] = (ch.exercises || []).map((ex: any) => {
      const ek = String(ex.exercise_number || 0);
      const al = answers[ek] || []; let ai = 0;
      return { id: ex.id, exercise_number: ex.exercise_number, subgroups: (ex.subgroups || []).map((sg: any) => ({
        instruction: sg.instruction || "",
        items: (sg.items || []).map((it: any, i: number) => ({ id: it.id || `${ex.id}-${i}`, text: it.text, answer: ai < al.length ? al[ai++] : null })),
      })) };
    });
    return { number: ch.number, title: ch.title, body: ch.body || [], exercises };
  });
  return { id: `vol-${m.number}`, number: m.number, title: m.title, chapters };
}
let _c: GrammarVolume[] | null = null;
export function getVolumes(): GrammarVolume[] { if (!_c) _c = meta.map(load); return _c; }
export function getChapter(vn: number, cn: number): { volume: GrammarVolume; chapter: GrammarChapter } | null {
  const v = getVolumes().find(x => x.number === vn); if (!v) return null; const c = v.chapters.find(x => x.number === cn); return c ? { volume: v, chapter: c } : null;
}
