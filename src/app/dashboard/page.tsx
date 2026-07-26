"use client"; import Link from "next/link"; import { useRouter } from "next/navigation"; import { useEffect, useState } from "react";
const mods = [
  {
    id: "A",
    label: "A",
    title: "Modern English Grammar & Composition",
    subtitle: "Interactive grammar lessons, exercises & volume readers",
    href: "/grammar",
    color: "from-pink-500 to-rose-700",
  },
  {
    id: "B",
    label: "B",
    title: "Questions & Answers",
    subtitle: "A place to test your skills and knowledge in Science, Mathematics and Computer",
    href: "/module/B",
    color: "from-amber-700 to-maroon",
  },
  {
    id: "C",
    label: "C",
    title: "CBSE Board Preparation",
    subtitle: "Complete Class X study notes, textbook solutions & MCQ board exam simulator",
    href: "/module/C",
    color: "from-emerald-800 to-teal-900",
  },
];

export default function DashboardPage() {
  const r = useRouter();
  const [u, setU] = useState<any>(null);

  useEffect(() => {
    const x = localStorage.getItem("user");
    if (x) setU(JSON.parse(x));
    if (!localStorage.getItem("token")) r.push("/");
  }, [r]);

  if (!u) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 fade-in">
      <h1 className="text-3xl font-serif font-bold text-maroon mb-2">
        Welcome, {u.name || "Student"}
      </h1>
      <p className="text-ink-light italic mb-6">Select a module to begin learning.</p>
      <hr className="single-rule mb-8" />
      
      <div className="grid md:grid-cols-3 gap-6">
        {mods.map((m) => (
          <Link
            key={m.id}
            href={m.href}
            className="group parchment-card p-6 rounded-xl flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 border border-maroon/20 hover:border-maroon/50"
          >
            <div
              className={`w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-transform group-hover:scale-105 mb-4`}
            >
              <span className="text-4xl md:text-5xl font-serif font-bold text-white">
                {m.label}
              </span>
            </div>
            <h3 className="text-lg font-serif font-bold text-maroon mb-2 group-hover:text-amber-800 transition-colors">
              {m.title}
            </h3>
            <p className="text-xs text-ink-light leading-relaxed">
              {m.subtitle}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
