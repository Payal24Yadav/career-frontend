import Link from "next/link";
import React from "react";
import { Award, CheckCircle2, RotateCcw, XCircle } from "lucide-react";

type Result = {
  examTitle: string;
  score: number;
  totalMarks: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  totalQuestions: number;
  percentage: number;
  sectionScores?: {
    sectionName: string;
    score: number;
    totalMarks: number;
    correctCount: number;
    wrongCount: number;
    unansweredCount: number;
    totalQuestions: number;
  }[];
};

export default function ResultCard({ result, retryHref }: { result: Result; retryHref: string }) {
  const message = result.percentage >= 75
    ? "Excellent attempt. Your accuracy is in a strong zone."
    : result.percentage >= 50
    ? "Good base. Review the wrong answers and tighten weak sections."
    : "Keep practicing. Focus on concepts first, then speed.";

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
        <Award className="w-8 h-8" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">Test Submitted</h1>
      <p className="text-gray-500 mt-2">{result.examTitle}</p>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Metric label="Score" value={`${result.score}/${result.totalMarks}`} />
        <Metric label="Percentage" value={`${result.percentage}%`} />
        <Metric label="Correct" value={result.correctCount} icon={<CheckCircle2 className="w-4 h-4 text-green-600" />} />
        <Metric label="Wrong" value={result.wrongCount} icon={<XCircle className="w-4 h-4 text-red-600" />} />
      </div>

      <p className="mt-8 text-sm text-gray-600 leading-relaxed">{message}</p>
      <p className="mt-2 text-xs text-gray-400">Unanswered: {result.unansweredCount} of {result.totalQuestions}</p>

      {result.sectionScores && result.sectionScores.length > 0 && (
        <div className="mt-8 text-left">
          <h2 className="text-sm font-extrabold text-navy uppercase tracking-wider mb-3">Section Breakdown</h2>
          <div className="space-y-3">
            {result.sectionScores.map((section) => (
              <div key={section.sectionName} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-navy">{section.sectionName}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {section.correctCount} correct, {section.wrongCount} wrong, {section.unansweredCount} unanswered
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-primary">{section.score}/{section.totalMarks}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase">{section.totalQuestions} questions</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
        <Link href={retryHref} className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90">
          <RotateCcw className="w-4 h-4" />
          Retake Test
        </Link>
        <Link href="/mock-tests" className="inline-flex items-center justify-center px-5 py-3 border border-gray-200 text-navy rounded-xl font-bold text-sm hover:bg-gray-50">
          Back to Mock Tests
        </Link>
      </div>
    </div>
  );
}

function Metric({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
      <div className="flex items-center justify-center gap-1 text-2xl font-extrabold text-navy">{icon}{value}</div>
      <div className="text-xs font-bold text-gray-400 uppercase mt-1">{label}</div>
    </div>
  );
}
