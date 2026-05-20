"use client";

export default function QuestionPalette({
  total,
  currentIndex,
  answers,
  onJump,
}: {
  total: number;
  currentIndex: number;
  answers: Record<string, number>;
  onJump: (index: number) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h3 className="font-bold text-navy mb-4">Question Palette</h3>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: total }).map((_, index) => {
          const answered = answers[String(index)] !== undefined;
          const active = index === currentIndex;

          return (
            <button
              key={index}
              type="button"
              onClick={() => onJump(index)}
              className={`aspect-square rounded-lg text-xs font-bold transition-colors ${
                active
                  ? "bg-primary text-white"
                  : answered
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
      <div className="mt-5 space-y-2 text-xs text-gray-500">
        <Legend className="bg-primary" label="Current" />
        <Legend className="bg-green-100 border border-green-200" label="Answered" />
        <Legend className="bg-gray-100 border border-gray-200" label="Unanswered" />
      </div>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded ${className}`} />
      {label}
    </div>
  );
}
