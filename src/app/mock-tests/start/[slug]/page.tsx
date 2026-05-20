"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Flag, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMockTestBySlugAPI, getQuestionsForTestAPI, submitMockTestAttemptAPI } from "@/services/api";
import QuestionCard from "@/components/mock-test/QuestionCard";
import QuestionPalette from "@/components/mock-test/QuestionPalette";
import SectionTabs from "@/components/mock-test/SectionTabs";
import Timer from "@/components/mock-test/Timer";

type Question = {
  _id: string;
  question: string;
  options: string[];
  sectionName?: string;
  section?: string;
  marks?: number;
  negativeMarks?: number;
};

type ExamSection = {
  name: string;
  duration?: number;
  totalQuestions?: number;
};

type MockTest = {
  _id: string;
  title: string;
  slug: string;
  duration?: number;
  totalMarks?: number;
  instructions?: string;
  examSections?: ExamSection[];
};

type TestUser = {
  userName: string;
  email: string;
  examSlug: string;
};

export default function StartMockTestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [mockTest, setMockTest] = useState<MockTest | null>(null);
  const [questionsBySection, setQuestionsBySection] = useState<Record<string, Question[]>>({});
  const [activeSection, setActiveSection] = useState("");
  const [sectionQuestionIndex, setSectionQuestionIndex] = useState<Record<string, number>>({});
  const [sectionSecondsLeft, setSectionSecondsLeft] = useState<Record<string, number>>({});
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [testUser, setTestUser] = useState<TestUser | null>(null);

  useEffect(() => {
    const savedUser = typeof window !== "undefined" ? sessionStorage.getItem("mockTestUser") : null;
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.examSlug === slug) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setTestUser(parsed);
        }
      } catch {
        setTestUser(null);
      }
    }
  }, [slug]);

  useEffect(() => {
    const loadTest = async () => {
      setLoading(true);
      try {
        const { data } = await getMockTestBySlugAPI(slug);
        const test = data.data;
        setMockTest(test);

        const questionsRes = await getQuestionsForTestAPI(test._id);
        const flatQuestions: Question[] = questionsRes.data.data || [];
        const grouped = flatQuestions.reduce((acc: Record<string, Question[]>, question) => {
          const sectionName = question.sectionName || question.section || "General";
          if (!acc[sectionName]) acc[sectionName] = [];
          acc[sectionName].push({ ...question, sectionName });
          return acc;
        }, {});

        const configuredSections = Array.isArray(test.examSections) && test.examSections.length > 0
          ? test.examSections
          : Object.keys(grouped).map((name) => ({ name, duration: test.duration || 30, totalQuestions: grouped[name].length }));
        const firstSection = configuredSections[0]?.name || Object.keys(grouped)[0] || "General";

        setQuestionsBySection(grouped);
        setActiveSection(firstSection);
        setSectionQuestionIndex(Object.fromEntries(configuredSections.map((section: ExamSection) => [section.name, 0])));
        setSectionSecondsLeft(Object.fromEntries(configuredSections.map((section: ExamSection) => [
          section.name,
          Math.max(1, section.duration || test.duration || 30) * 60,
        ])));
      } catch {
        toast.error("Failed to load mock test");
      } finally {
        setLoading(false);
      }
    };

    loadTest();
  }, [slug]);

  const examSections = useMemo<ExamSection[]>(() => {
    if (!mockTest) return [];
    if (Array.isArray(mockTest.examSections) && mockTest.examSections.length > 0) return mockTest.examSections;
    const names = Object.keys(questionsBySection);
    return names.length > 0
      ? names.map((name) => ({ name, duration: mockTest.duration || 30, totalQuestions: questionsBySection[name].length }))
      : [{ name: "General", duration: mockTest.duration || 30, totalQuestions: 0 }];
  }, [mockTest, questionsBySection]);

  const flatQuestions = useMemo(() => (
    examSections.flatMap((section) => questionsBySection[section.name] || [])
  ), [examSections, questionsBySection]);

  const activeQuestions = questionsBySection[activeSection] || [];
  const currentIndex = Math.min(sectionQuestionIndex[activeSection] || 0, Math.max(activeQuestions.length - 1, 0));
  const currentQuestion = activeQuestions[currentIndex];
  const activeSectionConfig = examSections.find((section) => section.name === activeSection);
  const questionCounts = Object.fromEntries(examSections.map((section) => [section.name, (questionsBySection[section.name] || []).length]));
  const sectionAnswers = Object.fromEntries(activeQuestions.map((question, index) => [String(index), answers[question._id]]).filter(([, value]) => value !== undefined));
  const answeredCount = Object.keys(answers).length;

  const answerPayload = useMemo(() => (
    flatQuestions.map((question) => ({
      questionId: question._id,
      selectedAnswer: answers[question._id] ?? null,
    }))
  ), [answers, flatQuestions]);

  const submitTest = useCallback(async () => {
    if (!mockTest || submitting) return;

    const user = testUser || {
      userName: "Guest Student",
      email: `guest-${Date.now()}@mocktest.local`,
      examSlug: slug,
    };

    setSubmitting(true);
    try {
      const { data } = await submitMockTestAttemptAPI({
        userName: user.userName,
        email: user.email,
        examSlug: mockTest.slug,
        answers: answerPayload,
      });
      toast.success("Test submitted successfully");
      router.push(`/mock-tests/result/${data.data.attemptId}`);
    } catch {
      toast.error("Failed to submit test");
    } finally {
      setSubmitting(false);
    }
  }, [answerPayload, mockTest, router, slug, submitting, testUser]);

  const handleSectionExpire = useCallback(() => {
    const activeIndex = examSections.findIndex((section) => section.name === activeSection);
    const nextSection = examSections[activeIndex + 1];
    if (nextSection) {
      toast.success(`${activeSection} time is over. Moving to ${nextSection.name}.`);
      setActiveSection(nextSection.name);
    } else {
      submitTest();
    }
  }, [activeSection, examSections, submitTest]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-20 flex flex-col items-center justify-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          Loading test...
        </div>
        <Footer />
      </main>
    );
  }

  if (!mockTest) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-navy">Mock Test Not Found</h1>
          <Link href="/mock-tests" className="inline-flex mt-6 px-5 py-3 bg-primary text-white rounded-xl font-bold">Back to Mock Tests</Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="pt-24 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href={`/mock-tests/${mockTest.slug}`} className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white mb-3">
              <ArrowLeft className="w-4 h-4" />
              Back to details
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{mockTest.title}</h1>
            <p className="text-sm text-gray-300 mt-1">{answeredCount}/{flatQuestions.length} answered</p>
          </div>
          <Timer
            durationMinutes={activeSectionConfig?.duration || mockTest.duration || 30}
            secondsLeft={sectionSecondsLeft[activeSection] ?? Math.max(1, activeSectionConfig?.duration || mockTest.duration || 30) * 60}
            onSecondsChange={(seconds) => setSectionSecondsLeft((current) => ({ ...current, [activeSection]: seconds }))}
            onExpire={handleSectionExpire}
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mockTest.instructions && (
          <div className="mb-6 bg-blue-50 border border-blue-100 rounded-2xl p-5 text-sm text-blue-900 whitespace-pre-wrap">
            {mockTest.instructions}
          </div>
        )}

        <div className="mb-6">
          <SectionTabs
            sections={examSections}
            activeSection={activeSection}
            questionCounts={questionCounts}
            onChange={setActiveSection}
          />
        </div>

        {flatQuestions.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-navy">No questions added yet</h2>
            <p className="text-gray-500 text-sm mt-2">Please check back once the admin has published questions for this test.</p>
          </div>
        ) : !currentQuestion ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-navy">No questions in {activeSection}</h2>
            <p className="text-gray-500 text-sm mt-2">Switch to another section or ask the admin to add questions here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
            <div className="space-y-5">
              <QuestionCard
                question={currentQuestion}
                index={currentIndex}
                selectedAnswer={answers[currentQuestion._id] ?? null}
                onAnswer={(answer) => setAnswers((current) => ({ ...current, [currentQuestion._id]: answer }))}
              />

              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setSectionQuestionIndex((current) => ({ ...current, [activeSection]: Math.max(0, currentIndex - 1) }))}
                  className="px-5 py-3 border border-gray-200 bg-white text-navy rounded-xl font-bold text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex gap-3">
                  {currentIndex < activeQuestions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setSectionQuestionIndex((current) => ({ ...current, [activeSection]: Math.min(activeQuestions.length - 1, currentIndex + 1) }))}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-bold text-sm"
                    >
                      Next <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={submitTest}
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl font-bold text-sm disabled:opacity-70"
                    >
                      {submitting ? "Submitting..." : "Submit Test"} <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <QuestionPalette
                total={activeQuestions.length}
                currentIndex={currentIndex}
                answers={sectionAnswers}
                onJump={(index) => setSectionQuestionIndex((current) => ({ ...current, [activeSection]: index }))}
              />
              <button
                type="button"
                onClick={submitTest}
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl font-bold text-sm disabled:opacity-70"
              >
                <Flag className="w-4 h-4" />
                {submitting ? "Submitting..." : "Finish Test"}
              </button>
            </aside>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
