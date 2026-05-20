import ScoreCard from "./ScoreCard";

type ResultSummaryProps = {
  result: {
    examTitle: string;
    totalQuestions: number;
    attemptedCount: number;
    correctCount: number;
    wrongCount: number;
    skippedCount: number;
    totalScore: number;
    totalMarks: number;
    percentage: number;
  };
};

export default function ResultSummary({ result }: ResultSummaryProps) {
  const pass = result.percentage >= 50;

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${pass ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {pass ? "Strong Attempt" : "Needs Review"}
          </span>
          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-navy">{result.examTitle} Result</h1>
          <p className="text-sm text-gray-500 mt-2">
            {pass ? "Good momentum. Review the misses and keep the rhythm." : "The review below will show exactly where to focus next."}
          </p>
        </div>

        <div className="relative w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <div className="absolute inset-2 rounded-full bg-white" />
          <div className="relative text-center">
            <div className="text-3xl font-extrabold text-primary">{result.percentage}%</div>
            <div className="text-[10px] font-bold uppercase text-gray-400">Score</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mt-8">
        <ScoreCard label="Total" value={result.totalQuestions} />
        <ScoreCard label="Attempted" value={result.attemptedCount} tone="blue" />
        <ScoreCard label="Correct" value={result.correctCount} tone="green" />
        <ScoreCard label="Wrong" value={result.wrongCount} tone="red" />
        <ScoreCard label="Skipped" value={result.skippedCount} tone="gray" />
        <ScoreCard label="Marks" value={`${result.totalScore}/${result.totalMarks}`} tone="blue" />
      </div>
    </div>
  );
}
