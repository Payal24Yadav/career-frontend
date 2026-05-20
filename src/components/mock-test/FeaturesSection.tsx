import React from "react";
import { CheckCircle, Sparkles } from "lucide-react";

export default function FeaturesSection({ data }: { data: { title?: string; content?: unknown } }) {
  if (!data || !data.content) return null;

  const features = Array.isArray(data.content)
    ? data.content.map((feature) => (
        typeof feature === "string" ? feature : readFeature(feature)
      )).filter(Boolean)
    : [];

  return (
    <div className="bg-navy border border-navy rounded-[2rem] p-6 sm:p-8 shadow-lg mb-6 animate-fade-in relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4 relative z-10">
        <Sparkles className="w-5 h-5 text-accent" />
        {data.title || "Key Features"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {features.map((feature: string, i: number) => (
          <div key={i} className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            <div className="bg-gradient-to-br from-primary to-accent w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-semibold text-gray-100 leading-relaxed">{feature}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function readFeature(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";
  const feature = "feature" in value ? value.feature : undefined;
  const description = "description" in value ? value.description : undefined;
  return typeof feature === "string" ? feature : typeof description === "string" ? description : "";
}
