import { AudioPlayer } from "./AudioQuestion";
import { VideoPlayer } from "./VideoQuestion";

type ReviewAnswer = {
  questionId: {
    _id: string;
    question: string;
    questionType?: "mcq" | "audio" | "video";
    audioUrl?: string;
    audioInstructions?: string;
    videoUrl?: string;
    videoInstructions?: string;
    allowReplay?: boolean;
    options: string[];
    explanation?: string;
    sectionName?: string;
    section?: string;
  };
  selectedAnswer: number | null;
  correctAnswer: number;
  status: "correct" | "wrong" | "skipped";
  marksAwarded: number;
  sectionName?: string;
};

export default function AnswerReviewCard({ answer, index }: { answer: ReviewAnswer; index: number }) {
  const question = answer.questionId || { question: "Question unavailable", options: [] };
  const status = answer.status || "skipped";
  const statusStyles = {
    correct: "bg-green-50 text-green-700 border-green-100",
    wrong: "bg-red-50 text-red-700 border-red-100",
    skipped: "bg-gray-50 text-gray-600 border-gray-100",
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-primary bg-primary/10 px-3 py-1 rounded-full">Q{index + 1}</span>
          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{answer.sectionName || question.sectionName || question.section || "General"}</span>
        </div>
        <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full border ${statusStyles[status]}`}>
          {status}
        </span>
      </div>

      <h3 className="font-bold text-navy leading-relaxed whitespace-pre-wrap">{question.question}</h3>

      {question.questionType === "audio" && (
        <div className="mt-4 space-y-3">
          {question.audioInstructions && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
              <div className="text-xs font-extrabold uppercase text-indigo-700 mb-1">Audio Instructions</div>
              <p className="text-sm text-indigo-950 whitespace-pre-wrap">{question.audioInstructions}</p>
            </div>
          )}
          <AudioPlayer src={question.audioUrl || ""} allowReplay />
        </div>
      )}

      {question.questionType === "video" && (
        <div className="mt-4 space-y-3">
          {question.videoInstructions && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
              <div className="text-xs font-extrabold uppercase text-indigo-700 mb-1">Video Instructions</div>
              <p className="text-sm text-indigo-950 whitespace-pre-wrap">{question.videoInstructions}</p>
            </div>
          )}
          <VideoPlayer src={question.videoUrl || ""} allowReplay />
        </div>
      )}

      <div className="mt-5 space-y-2">
        {question.options.map((option, optionIndex) => {
          const isSelected = answer.selectedAnswer === optionIndex;
          const isCorrect = answer.correctAnswer === optionIndex;

          return (
            <div
              key={optionIndex}
              className={`rounded-xl border p-3 text-sm flex gap-3 ${
                isCorrect
                  ? "border-green-200 bg-green-50 text-green-800"
                  : isSelected
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-gray-100 bg-gray-50 text-gray-600"
              }`}
            >
              <span className="font-bold">{String.fromCharCode(65 + optionIndex)}.</span>
              <span>{option}</span>
              {isCorrect && <span className="ml-auto text-xs font-bold">Correct</span>}
              {isSelected && !isCorrect && <span className="ml-auto text-xs font-bold">Selected</span>}
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <Info label="Your Answer" value={answer.selectedAnswer === null ? "Skipped" : question.options[answer.selectedAnswer] || "-"} />
        <Info label="Correct Answer" value={question.options[answer.correctAnswer] || "-"} />
        <Info label="Marks" value={answer.marksAwarded} />
      </div>

      {question.explanation && (
        <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 p-4">
          <div className="text-xs font-extrabold uppercase text-blue-700 mb-1">Explanation</div>
          <p className="text-sm text-blue-900 leading-relaxed whitespace-pre-wrap">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
      <div className="font-bold text-navy">{value}</div>
      <div className="text-[10px] font-bold uppercase text-gray-400 mt-1">{label}</div>
    </div>
  );
}
