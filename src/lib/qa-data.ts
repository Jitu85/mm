import qaData from "@/data/qa_data.json";

export interface QAItem {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  subject: string;
  series: string;
}

export interface QASubjectMeta {
  subject: string;
  count: number;
  description: string;
  icon: string;
}

export function getAllQAItems(): QAItem[] {
  return (qaData as QAItem[]) || [];
}


export function getQASubjects(): QASubjectMeta[] {
  const items = getAllQAItems();
  const counts: Record<string, number> = {};

  items.forEach((item) => {
    const s = item.subject || "General";
    counts[s] = (counts[s] || 0) + 1;
  });

  const subjectMetaMap: Record<string, { description: string; icon: string }> = {
    Mathematics: {
      description: "Arithmetic, Algebra, Geometry & Logic Problems",
      icon: "📐",
    },
    Science: {
      description: "Physics, Chemistry, Biology & Earth Exploration",
      icon: "🔬",
    },
    "Computer Applications": {
      description: "Networking, HTML, Web & Software Fundamentals",
      icon: "💻",
    },
    "Artificial Intelligence": {
      description: "Machine Learning, NLP, Computer Vision & Ethics",
      icon: "🤖",
    },
  };

  return Object.keys(counts).map((subj) => ({
    subject: subj,
    count: counts[subj],
    description: subjectMetaMap[subj]?.description || "Practice questions",
    icon: subjectMetaMap[subj]?.icon || "📚",
  }));
}

export function getFilteredQAItems(options?: {
  subject?: string;
  series?: string;
  limit?: number;
  shuffle?: boolean;
}): QAItem[] {
  let items = [...getAllQAItems()];

  if (options?.subject && options.subject !== "All") {
    items = items.filter(
      (item) => item.subject.toLowerCase() === options.subject?.toLowerCase()
    );
  }

  if (options?.series && options.series !== "All") {
    items = items.filter((item) => item.series === options.series);
  }

  if (options?.shuffle) {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
  }

  if (options?.limit && options.limit > 0) {
    items = items.slice(0, options.limit);
  }

  return items;
}
