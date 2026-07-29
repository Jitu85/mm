"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { getChapter } from "@/lib/grammar-data";

function norm(s: string) {
  return s.replace(/[^a-z0-9\s]/gi, "").toLowerCase().trim();
}

function lr(a: string, b: string): number {
  const an = norm(a),
    bn = norm(b);
  if (an === bn) return 1;
  const m = an.length,
    n = bn.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        an[i - 1] === bn[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return 1 - dp[m][n] / Math.max(m, n, 1);
}

function renderBody(item: any): string {
  if (item.type === "table" && item.rows)
    return (
      "<table class='w-full border-collapse border border-gold/50 my-2'>" +
      item.rows
        .map(
          (r: string[]) =>
            "<tr>" +
            r
              .map(
                (c: string) =>
                  `<td class='border border-gold/30 px-3 py-2 text-sm'>${c}</td>`
              )
              .join("") +
            "</tr>"
        )
        .join("") +
      "</table>"
    );
  return item.html || `<p>${item.plain || ""}</p>`;
}

export default function ChapterClient({
  volumeNum,
  chapterNum,
}: {
  volumeNum: string;
  chapterNum: string;
}) {
  const vn = volumeNum;
  const cn = chapterNum;
  const [ch, setCh] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [ans, setAns] = useState<Record<string, string>>({});
  const [rev, setRev] = useState<
    Record<string, "correct" | "incorrect" | null>
  >({});

  useEffect(() => {
    const res = getChapter(parseInt(vn, 10), parseInt(cn, 10));
    setCh(res ? res.chapter : null);
    setLoading(false);
  }, [vn, cn]);

  const showAns = useCallback(
    (id: string, correct: string | null) => {
      if (!correct) {
        setRev((r) => ({ ...r, [id]: "incorrect" }));
        return;
      }
      setRev((r) => ({
        ...r,
        [id]: lr(ans[id] || "", correct) >= 0.85 ? "correct" : "incorrect",
      }));
    },
    [ans]
  );

  if (loading)
    return (
      <div className="text-center py-16 font-serif text-maroon">
        <div className="inline-block animate-spin text-3xl mb-2">📖</div>
        <p className="font-bold">Opening Chapter Lesson...</p>
      </div>
    );

  if (!ch)
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-serif font-bold text-maroon mb-2">
          Chapter Not Found
        </h1>
        <p className="text-ink-light font-serif mb-6">
          The requested chapter could not be located.
        </p>
        <Link
          href="/grammar"
          className="btn-maroon inline-block px-6 py-3 rounded-lg"
        >
          Back to Index
        </Link>
      </div>
    );

  const volCover =
    vn === "1"
      ? "/images/vol1-cover.svg"
      : vn === "2"
      ? "/images/vol2-cover.svg"
      : "/images/vol3-cover.svg";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 fade-in">
      <div className="mb-6">
        <Link
          href="/grammar"
          className="text-maroon hover:underline text-sm font-serif font-bold inline-flex items-center gap-1 mb-4"
        >
          ← Back to Grammar Index
        </Link>

        {/* Chapter Visual Banner Card */}
        <div className="parchment-card p-6 md:p-8 rounded-2xl border border-maroon/20 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-maroon text-gold-light text-xs font-serif font-bold px-3 py-1 rounded-full shadow-sm">
                Volume {vn}
              </span>
              <span className="bg-amber-100 text-maroon text-xs font-serif font-bold px-3 py-1 rounded-full border border-amber-300">
                Chapter {ch.number}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-maroon">
              {ch.title}
            </h1>
          </div>

          <div
            className="w-32 h-20 md:w-40 md:h-24 rounded-xl bg-cover bg-center shrink-0 shadow-inner border border-maroon/30"
            style={{ backgroundImage: `url('${volCover}')` }}
          />
        </div>
      </div>

      <hr className="double-rule mb-6" />

      {/* Chapter Lesson Body */}
      <div className="parchment-card rounded-2xl p-6 md:p-10 mb-8 border border-maroon/20 shadow-sm leading-relaxed text-ink font-serif text-base md:text-lg">
        {ch.body.map((item: any, i: number) => (
          <div
            key={i}
            dangerouslySetInnerHTML={{ __html: renderBody(item) }}
          />
        ))}
      </div>

      {/* Quiz / Exercises Section */}
      {!show ? (
        <div className="text-center mb-8">
          <button
            onClick={() => setShow(true)}
            className="btn-maroon px-10 py-4 rounded-xl font-serif font-bold text-lg shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>📝</span> Test Yourself (Chapter Exercises)
          </button>
        </div>
      ) : (
        <div className="space-y-8 mt-8 fade-in">
          <hr className="double-rule" />
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-maroon flex items-center gap-2">
              <span>✍️</span> Chapter Exercises
            </h2>
            <button
              onClick={() => {
                setShow(false);
                setAns({});
                setRev({});
              }}
              className="text-xs font-serif font-bold text-maroon bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-300 hover:bg-amber-200"
            >
              Hide Exercises
            </button>
          </div>

          {ch.exercises.length === 0 && (
            <p className="text-ink-light italic font-serif">
              No exercise items extracted for this chapter.
            </p>
          )}

          {ch.exercises.map((ex: any) => (
            <div key={ex.id} className="space-y-6">
              {ex.subgroups.map((sg: any, si: number) => (
                <div
                  key={si}
                  className="parchment-card rounded-2xl p-6 md:p-8 border border-maroon/20"
                >
                  {sg.instruction && (
                    <p className="italic text-maroon font-semibold mb-4 font-serif bg-amber-50 p-3 rounded-lg border border-amber-200">
                      &ldquo;{sg.instruction}&rdquo;
                    </p>
                  )}
                  <ol className="space-y-6 list-decimal list-inside font-serif">
                    {sg.items.map((item: any) => (
                      <li key={item.id} className="text-ink text-base">
                        <div
                          className="inline font-medium"
                          dangerouslySetInnerHTML={{ __html: item.text }}
                        />
                        <div className="ml-6 mt-3 space-y-2">
                          <input
                            value={ans[item.id] || ""}
                            onChange={(e) =>
                              setAns((a) => ({
                                ...a,
                                [item.id]: e.target.value,
                              }))
                            }
                            placeholder="Type your answer..."
                            className="w-full max-w-md px-4 py-2 rounded-xl text-sm border border-maroon/30 focus:outline-none focus:ring-2 focus:ring-maroon bg-white"
                          />
                          <div className="flex items-center gap-3 flex-wrap">
                            <button
                              onClick={() => showAns(item.id, item.answer)}
                              className="btn-gold px-4 py-1.5 rounded-lg text-xs font-bold font-serif"
                            >
                              {rev[item.id] === "correct"
                                ? "✅ Correct!"
                                : rev[item.id] === "incorrect"
                                ? "❌ Incorrect"
                                : "Show Answer"}
                            </button>
                            {rev[item.id] && (
                              <span className="text-sm font-serif">
                                {item.answer ? (
                                  <span className="text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                                    Answer: {item.answer}
                                  </span>
                                ) : (
                                  <span className="text-ink-light italic">
                                    No answer key available.
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          ))}

          <div className="text-center pt-4">
            <button
              onClick={() => {
                setShow(false);
                setAns({});
                setRev({});
              }}
              className="btn-maroon px-8 py-3 rounded-xl font-serif font-bold text-sm"
            >
              Hide Exercises
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
