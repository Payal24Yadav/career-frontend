import React from "react";
import { DownloadCloud, FileDown } from "lucide-react";
import Link from "next/link";

export default function ResourcesSection({ data }: { data: { title?: string; content?: unknown } }) {
  if (!data || !data.content) return null;

  const resources = Array.isArray(data.content) ? data.content.filter(isRecord) : [];

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-sm mb-6 animate-fade-in">
      <h3 className="text-xl font-bold text-navy mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
        <DownloadCloud className="w-5 h-5 text-primary" />
        {data.title || "Downloadable Resources"}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {resources.map((resource, i: number) => {
          const name = asText(resource.name) || asText(resource.resourceName) || "Resource";
          const fileUrl = asText(resource.fileUrl) || asText(resource.link) || "#";

          return (
            <Link
              key={i}
              href={fileUrl}
              target={fileUrl.startsWith("http") ? "_blank" : undefined}
              className="group flex items-center gap-4 p-4 bg-gray-50 hover:bg-primary/5 rounded-xl border border-gray-100 hover:border-primary/20 transition-all"
            >
              <span className="w-11 h-11 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 group-hover:border-primary/30">
                <FileDown className="w-5 h-5 text-primary" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-navy group-hover:text-primary transition-colors truncate">
                  {name}
                </span>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                  Download File
                </span>
              </span>
            </Link>
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
