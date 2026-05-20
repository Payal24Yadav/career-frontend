"use client";

type ExamSection = {
  name: string;
  duration?: number;
  totalQuestions?: number;
};

export default function SectionTabs({
  sections,
  activeSection,
  questionCounts,
  onChange,
}: {
  sections: ExamSection[];
  activeSection: string;
  questionCounts: Record<string, number>;
  onChange: (sectionName: string) => void;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-2 shadow-sm flex flex-wrap gap-2">
      {sections.map((section) => {
        const active = section.name === activeSection;
        const count = questionCounts[section.name] ?? section.totalQuestions ?? 0;

        return (
          <button
            key={section.name}
            type="button"
            onClick={() => onChange(section.name)}
            className={`px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
              active ? "bg-primary text-white" : "bg-gray-50 text-navy hover:bg-primary/10"
            }`}
          >
            {section.name} <span className={active ? "text-white/80" : "text-gray-400"}>({count})</span>
          </button>
        );
      })}
    </div>
  );
}
