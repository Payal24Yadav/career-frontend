import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTASection({ data }: { data: {
  title?: string;
  content?: unknown;
} }) {
  if (!data || !data.content) return null;

  const rawContent = isRecord(data.content) ? data.content : {};
  const content = {
    heading: asText(rawContent.heading) || data.title || "Ready to Start?",
    description: asText(rawContent.description) || asText(rawContent.text) || "Join thousands of students cracking their dream exams with our mock tests.",
    buttonText: asText(rawContent.buttonText) || "Start Practice Now",
    buttonLink: asText(rawContent.buttonLink) || asText(rawContent.link) || "#",
  };

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-[2rem] p-8 sm:p-12 text-center shadow-sm mb-6 animate-fade-in">
      <h3 className="text-2xl sm:text-3xl font-extrabold text-navy mb-4">
        {content.heading}
      </h3>
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-sm sm:text-base">
        {content.description}
      </p>
      <Link
        href={content.buttonLink}
        className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold tracking-widest text-sm uppercase transition-all shadow-lg hover:-translate-y-1"
      >
        {content.buttonText} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asText(value: unknown) {
  return typeof value === "string" ? value : "";
}
