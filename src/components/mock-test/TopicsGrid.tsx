import React from "react";
import { BookOpen, CheckCircle2 } from "lucide-react";

export default function TopicsGrid({ data }: { data: any }) {
  if (!data || !data.content) return null;
  const subjects = Array.isArray(data.content) ? data.content : [];

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-sm mb-6 animate-fade-in">
      <h3 className="text-xl font-bold text-navy mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
        <BookOpen className="w-5 h-5 text-primary" /> 
        {data.title || "Key Topics & Syllabus"}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((sub: any, i: number) => (
          <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h4 className="font-extrabold text-navy text-base mb-4 uppercase tracking-wider text-xs border-b border-gray-200 pb-2">
              {sub.subject}
            </h4>
            <ul className="space-y-3">
              {(sub.topics || []).map((topic: string, j: number) => (
                <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
