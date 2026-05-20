"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMockTestAttemptAPI } from "@/services/api";
import AnswerReviewCard from "@/components/mock-test/AnswerReviewCard";
import ResultSummary from "@/components/mock-test/ResultSummary";
import SectionAnalysis from "@/components/mock-test/SectionAnalysis";

type Attempt = {
  _id: string;
  examSlug: string;
  examTitle: string;
  totalScore: number;
  score?: number;
  totalMarks: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  unansweredCount?: number;
  totalQuestions: number;
  attemptedCount: number;
  percentage: number;
  sectionWiseScore?: any[];
  sectionScores?: any[];
  answers: any[];
};

export default function MockTestResultPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = use(params);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttempt = async () => {
      setLoading(true);
      try {
        const { data } = await getMockTestAttemptAPI(attemptId);
        setAttempt(data.data);
      } catch {
        toast.error("Failed to load result");
      } finally {
        setLoading(false);
      }
    };

    loadAttempt();
  }, [attemptId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-20 flex flex-col items-center justify-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          Loading result...
        </div>
        <Footer />
      </main>
    );
  }

  if (!attempt) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-navy">Result Not Found</h1>
          <Link href="/mock-tests" className="inline-flex mt-6 px-5 py-3 bg-primary text-white rounded-xl font-bold">Back to Mock Tests</Link>
        </div>
        <Footer />
      </main>
    );
  }

  const summary = {
    examTitle: attempt.examTitle,
    totalQuestions: attempt.totalQuestions,
    attemptedCount: attempt.attemptedCount,
    correctCount: attempt.correctCount,
    wrongCount: attempt.wrongCount,
    skippedCount: attempt.skippedCount ?? attempt.unansweredCount ?? 0,
    totalScore: attempt.totalScore ?? attempt.score ?? 0,
    totalMarks: attempt.totalMarks,
    percentage: attempt.percentage,
  };
  const sectionScores = attempt.sectionWiseScore?.length ? attempt.sectionWiseScore : attempt.sectionScores || [];

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <ResultSummary result={summary} />
          <SectionAnalysis sections={sectionScores} />

          <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-navy">Answer Review</h2>
              <p className="text-sm text-gray-500 mt-1">Review every question, your answer, the correct answer, and the explanation.</p>
            </div>
            <div className="flex gap-3">
              <Link href={`/mock-tests/${attempt.examSlug}`} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90">
                <RotateCcw className="w-4 h-4" />
                Retake Test
              </Link>
              <Link href="/mock-tests" className="px-4 py-2.5 border border-gray-200 bg-white text-navy rounded-xl font-bold text-sm hover:bg-gray-50">
                Back to Mock Tests
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {attempt.answers.map((answer, index) => (
              <AnswerReviewCard key={answer.questionId?._id || index} answer={answer} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
