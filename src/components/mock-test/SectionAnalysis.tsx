type SectionScore = {
  sectionName: string;
  score: number;
  totalMarks: number;
  correctCount: number;
  wrongCount: number;
  skippedCount?: number;
  unansweredCount?: number;
  totalQuestions: number;
};

export default function SectionAnalysis({ sections }: { sections: SectionScore[] }) {
  if (!sections.length) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-navy mb-5">Section Analysis</h2>
      <div className="space-y-4">
        {sections.map((section) => {
          const skipped = section.skippedCount ?? section.unansweredCount ?? 0;
          const accuracy = section.totalQuestions > 0 ? Math.round((section.correctCount / section.totalQuestions) * 100) : 0;

          return (
            <div key={section.sectionName} className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-navy">{section.sectionName}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {section.correctCount} correct | {section.wrongCount} wrong | {skipped} skipped
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold text-primary">{section.score}/{section.totalMarks}</div>
                  <div className="text-[10px] font-bold uppercase text-gray-400">{accuracy}% accuracy</div>
                </div>
              </div>
              <div className="mt-4 h-2 rounded-full bg-white overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(accuracy, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
