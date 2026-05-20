import React from "react";
import { BookOpen, CheckCircle2 } from "lucide-react";

export default function SyllabusSection({ data }: { data: {
  title?: string;
  content?: unknown;
} }) {
  if (!data || !data.content) return null;

  const categories = Array.isArray(data.content) ? data.content.filter(isRecord) : [];

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-sm mb-6 animate-fade-in">
      <h3 className="text-xl font-bold text-navy mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
        <BookOpen className="w-5 h-5 text-primary" />
        {data.title || "Syllabus"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {categories.map((category, i: number) => {
          const topics = Array.isArray(category.topics)
            ? category.topics.filter((topic): topic is string => typeof topic === "string" && Boolean(topic))
            : [];

          return (
            <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <h4 className="text-sm font-extrabold text-navy uppercase tracking-wider mb-4">
                {asText(category.section) || asText(category.subject) || "Section"}
              </h4>
              <ul className="space-y-3">
                {topics.map((topic: string, topicIndex: number) => (
                  <li key={topicIndex} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asText(value: unknown) {
  return typeof value === "string" ? value : "";
}
