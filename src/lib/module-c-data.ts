import notesData from "@/data/module_c_notes.json";
import sampleMcqs from "@/data/module_c_sample_mcqs.json";
import boardMcqs from "@/data/module_c_board_mcqs.json";

export interface BookNote {
  subject: string;
  book: string;
  chapters: {
    title: string;
    subsections: string[];
    content: string[];
    qa?: {
      question: string;
      answer: string;
    }[];
  }[];
}

export interface CBSEMCQItem {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  subject: string;
  series: string;
  dataset: string;
}

export function getModuleCNotes(subject?: string): BookNote[] {
  if (!subject || subject === "All") {
    return notesData as BookNote[];
  }
  return (notesData as BookNote[]).filter(
    (n) => n.subject.toLowerCase() === subject.toLowerCase()
  );
}

export function getModuleCMCQs(options: {
  subject?: string;
  dataset?: "sample" | "board" | "all";
  series?: string;
  limit?: number;
  shuffle?: boolean;
}): CBSEMCQItem[] {
  let pool: CBSEMCQItem[] = [];

  const dataset = options.dataset || "all";
  if (dataset === "sample") {
    pool = [...(sampleMcqs as CBSEMCQItem[])];
  } else if (dataset === "board") {
    pool = [...(boardMcqs as CBSEMCQItem[])];
  } else {
    pool = [...(sampleMcqs as CBSEMCQItem[]), ...(boardMcqs as CBSEMCQItem[])];
  }

  if (options.subject && options.subject !== "All") {
    const sLower = options.subject.toLowerCase();
    pool = pool.filter((q) => q.subject.toLowerCase() === sLower);
  }

  if (options.series && options.series !== "All") {
    pool = pool.filter((q) => q.series === options.series);
  }

  if (options.shuffle) {
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
  }

  if (options.limit && options.limit > 0) {
    pool = pool.slice(0, options.limit);
  }

  return pool;
}

export function getModuleCMeta() {
  const allNotes = notesData as BookNote[];
  const allSample = sampleMcqs as CBSEMCQItem[];
  const allBoard = boardMcqs as CBSEMCQItem[];

  const subjectCounts: Record<string, { notes: number; sample: number; board: number }> = {
    English: { notes: 0, sample: 0, board: 0 },
    Mathematics: { notes: 0, sample: 0, board: 0 },
    Science: { notes: 0, sample: 0, board: 0 },
    Computer: { notes: 0, sample: 0, board: 0 },
  };

  allNotes.forEach((b) => {
    if (subjectCounts[b.subject]) {
      subjectCounts[b.subject].notes += b.chapters.length;
    }
  });

  allSample.forEach((q) => {
    if (!subjectCounts[q.subject]) {
      subjectCounts[q.subject] = { notes: 0, sample: 0, board: 0 };
    }
    subjectCounts[q.subject].sample += 1;
  });

  allBoard.forEach((q) => {
    if (!subjectCounts[q.subject]) {
      subjectCounts[q.subject] = { notes: 0, sample: 0, board: 0 };
    }
    subjectCounts[q.subject].board += 1;
  });

  const boardSeriesList = Array.from(new Set(allBoard.map((q) => q.series))).sort();

  return {
    totalNotesBooks: allNotes.length,
    totalSampleMCQs: allSample.length,
    totalBoardMCQs: allBoard.length,
    subjectCounts,
    boardSeriesList,
  };
}
