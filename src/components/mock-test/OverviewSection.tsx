import React from "react";
import { CheckCircle2, FileText } from "lucide-react";

export default function OverviewSection({ data }: { data: {
  title?: string;
  content?: unknown;
} }) {
  if (!data) return null;

  const rawContent = isRecord(data.content) ? data.content : {};
  const content = typeof data.content === "string"
    ? { description: data.content, highlights: [] }
    : rawContent;
  const highlights = Array.isArray(content.highlights)
    ? content.highlights.filter((highlight): highlight is string => typeof highlight === "string" && Boolean(highlight))
    : [];

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-sm mb-6 animate-fade-in">
      <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2 border-b border-gray-100 pb-4">
        <FileText className="w-5 h-5 text-primary" />
        {data.title || "Overview"}
      </h3>

      {typeof content.description === "string" && content.description && (
        <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
          {content.description}
        </p>
      )}

      {highlights.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          {highlights.map((highlight: string, i: number) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-primary/10 bg-primary/5 p-4">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <span className="text-sm font-semibold text-navy leading-relaxed">{highlight}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
