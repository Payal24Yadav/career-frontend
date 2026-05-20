"use client";

import AudioQuestion from "./AudioQuestion";
import VideoQuestion from "./VideoQuestion";

type Question = {
  _id: string;
  question: string;
  questionType?: "mcq" | "audio" | "video";
  audioUrl?: string;
  audioInstructions?: string;
  videoUrl?: string;
  videoInstructions?: string;
  allowReplay?: boolean;
  options: string[];
  sectionName?: string;
  section?: string;
  marks?: number;
  negativeMarks?: number;
};

export default function QuestionCard({
  question,
  index,
  selectedAnswer,
  onAnswer,
}: {
  question: Question;
  index: number;
  selectedAnswer: number | null;
  onAnswer: (answer: number) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="text-xs font-extrabold text-primary bg-primary/10 px-3 py-1 rounded-full">Question {index + 1}</span>
        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{question.sectionName || question.section || "General"}</span>
        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{question.marks || 1} mark(s)</span>
      </div>

      {question.questionType === "audio" ? (
        <AudioQuestion question={question} selectedAnswer={selectedAnswer} onAnswer={onAnswer} />
      ) : question.questionType === "video" ? (
        <VideoQuestion question={question} selectedAnswer={selectedAnswer} onAnswer={onAnswer} />
      ) : (
        <>
          <h2 className="text-lg sm:text-xl font-bold text-navy leading-relaxed whitespace-pre-wrap">{question.question}</h2>

          <div className="mt-8 space-y-3">
            {question.options.map((option, optionIndex) => (
              <button
                key={optionIndex}
                type="button"
                onClick={() => onAnswer(optionIndex)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex gap-3 items-start ${
                  selectedAnswer === optionIndex
                    ? "border-primary bg-primary/5 text-navy shadow-sm"
                    : "border-gray-200 bg-white hover:border-primary/40 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  selectedAnswer === optionIndex ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {String.fromCharCode(65 + optionIndex)}
                </span>
                <span className="text-sm leading-relaxed">{option}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
