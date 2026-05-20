"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMockTestBySlugAPI, getMockTestsAPI, submitInquiryAPI } from "@/services/api";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

import OverviewSection from "./mock-test/OverviewSection";
import ExamPatternSection from "./mock-test/ExamPatternSection";
import StrategySection from "./mock-test/StrategySection";
import CutoffTable from "./mock-test/CutoffTable";
import TopicsGrid from "./mock-test/TopicsGrid";
import SyllabusSection from "./mock-test/SyllabusSection";
import FAQSection from "./mock-test/FAQSection";
import ResourcesSection from "./mock-test/ResourcesSection";
import FeaturesSection from "./mock-test/FeaturesSection";
import CTASection from "./mock-test/CTASection";
import RegistrationForm from "./mock-test/RegistrationForm";

interface MockTest {
  _id: string;
  title: string;
  slug: string;
  category: string;
  subtitle: string;
  badgeType?: string;
  shortDescription?: string;
  duration?: number;
  totalQuestions?: number;
  totalMarks?: number;
  instructions?: string;
  examSections?: { name: string; duration?: number; totalQuestions?: number }[];
  sections?: { type: string; title?: string; content: unknown }[];
  status: string;
  isFeatured: boolean;
}

export default function MockTestDetailsClient({ slug }: { slug: string }) {
  const [mockTest, setMockTest] = useState<MockTest | null>(null);
  const [relatedTests, setRelatedTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);

  // General Counselling Form State
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "Mock Test Prep Support",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMockTest = async () => {
      setLoading(true);
      try {
        const { data } = await getMockTestBySlugAPI(slug);
        const item = data.data || null;
        if (item) {
          setMockTest(item);
          // Fetch related exams in same category
          const relatedRes = await getMockTestsAPI(
            `category=${encodeURIComponent(item.category)}&limit=4`
          );
          const filtered = (relatedRes.data.data || []).filter(
            (t: MockTest) => t._id !== item._id
          );
          setRelatedTests(filtered.slice(0, 3));
        } else {
          // Alternative fallback direct query if list has different response
          const directRes = await getMockTestsAPI();
          const backupItem = (directRes.data.data || []).find((t: MockTest) => t.slug === slug);
          if (backupItem) {
            setMockTest(backupItem);
            const filtered = (directRes.data.data || []).filter(
              (t: MockTest) => t.category === backupItem.category && t._id !== backupItem._id
            );
            setRelatedTests(filtered.slice(0, 3));
          }
        }
      } catch {
        toast.error("Failed to load mock test details");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchMockTest();
    }
  }, [slug]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const toastId = toast.loading("Sending your application prep inquiry...");
    try {
      await submitInquiryAPI(inquiryForm);
      toast.success("Enquiry received! A senior counselor will contact you within 24 hours.", { id: toastId });
      setInquiryForm({
        name: "",
        email: "",
        phone: "",
        course: "Mock Test Prep Support",
        message: "",
      });
    } catch {
      toast.error("Failed to submit request. Please try again.", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const startTest = () => {
    document.getElementById("mock-test-registration")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const getRoute = (s: string) => {
    if (s === "cat-mock-test") return "/tools/cat-mock-test";
    if (s === "snap") return "/tools/mock-test/snap";
    if (s === "atma-mock-test") return "/tools/atma-mock-test";
    return `/mock-tests/${s}`;
  };

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">Loading Exam Simulator Details...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!mockTest) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-navy mb-2">Mock Test Not Found</h2>
          <p className="text-gray-500 mb-6">The requested mock test could not be resolved.</p>
          <Link href="/mock-tests" className="px-6 py-3 bg-primary text-white rounded-xl font-bold">
            Back to Mock Tests Hub
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-24 pb-12 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase bg-white/10 text-accent px-3 py-1 rounded-full border border-accent/20">
                {mockTest.category}
              </span>
              {mockTest.badgeType && (
                <span className="text-[10px] font-extrabold uppercase bg-rose-500 text-white px-3 py-1 rounded-full shadow-md animate-pulse">
                  {mockTest.badgeType}
                </span>
              )}
            </div>
            <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              {mockTest.title} <span className="gradient-text">Mock Test Hub</span>
            </h1>
            <p className="mt-3 text-lg font-semibold text-gray-300">{mockTest.subtitle}</p>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-2xl">{mockTest.shortDescription}</p>
          </div>

          <button
            onClick={startTest}
            className="px-8 py-5 bg-gradient-to-r from-primary to-blue-500 hover:from-blue-600 hover:to-primary text-white text-sm font-extrabold uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] shrink-0 self-start md:self-auto flex items-center gap-2"
          >
            Start Free Mock Test <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Main Details and Tabbed Layout */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Details side */}
          <div className="flex-1 space-y-8">
            <RegistrationForm examTitle={mockTest.title} examSlug={mockTest.slug} />
            <ExamOverview mockTest={mockTest} />

            {/* Dynamic Tabs Card */}
            {mockTest.sections && mockTest.sections.length > 0 ? (
              mockTest.sections.map((section, index) => {
                switch (section.type) {
                  case "overview": return <OverviewSection key={index} data={section} />;
                  case "examPattern": return <ExamPatternSection key={index} data={section} />;
                  case "cutoff": return <CutoffTable key={index} data={section} />;
                  case "strategy": return <StrategySection key={index} data={section} />;
                  case "syllabus": return <SyllabusSection key={index} data={section} />;
                  case "topics": return <TopicsGrid key={index} data={section} />;
                  case "faq": return <FAQSection key={index} data={section} />;
                  case "resources": return <ResourcesSection key={index} data={section} />;
                  case "features": return <FeaturesSection key={index} data={section} />;
                  case "cta": return <CTASection key={index} data={section} />;
                  default: return null;
                }
              })
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border border-gray-100 shadow-sm">
                No detailed sections found for this test yet.
              </div>
            )}
          </div>

          {/* Enquiry side */}
          <aside className="w-full lg:w-96 shrink-0">
            <div className="sticky top-28 bg-white border border-gray-100 rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary to-accent" />
              <h3 className="text-xl font-bold text-navy mb-2">Crack {mockTest.title} in 2026</h3>
              <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                Connect with our expert exam mentors to obtain direct prep material, custom schedules, and professional mentoring reviews.
              </p>

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-navy"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-navy"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Phone Number *</label>
                  <input
                    required
                    type="tel"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-navy"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Your Query / Target Rank</label>
                  <textarea
                    rows={3}
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-navy resize-none"
                    placeholder={`I am preparing for ${mockTest.title} mock test...`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-primary/20 hover:scale-[1.01]"
                >
                  {submitting ? "Submitting..." : "Connect With Mentor"}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </section>

      {/* Related Exams Section */}
      {relatedTests && relatedTests.length > 0 && (
        <section className="py-12 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-extrabold text-navy mb-8">
              Explore Related <span className="gradient-text">Mock Exams</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTests.map((t) => (
                <Link
                  key={t._id}
                  href={getRoute(t.slug)}
                  className="group bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold text-primary uppercase bg-primary/5 px-2.5 py-1 rounded-full">
                      {t.category}
                    </span>
                    {t.badgeType && (
                      <span className="text-[9px] font-extrabold uppercase bg-rose-500 text-white px-2 py-0.5 rounded shadow">
                        {t.badgeType}
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-navy mt-2 group-hover:text-primary transition-colors">
                    {t.title}
                  </h4>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed line-clamp-2">
                    {t.subtitle}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs font-bold text-primary border-t border-gray-50 pt-4">
                    <span>Try Mock Now</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

function ExamOverview({ mockTest }: { mockTest: MockTest }) {
  const sections = Array.isArray(mockTest.examSections) ? mockTest.examSections : [];

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-navy mb-5">Exam Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <OverviewMetric label="Duration" value={`${mockTest.duration || 0} min`} />
        <OverviewMetric label="Questions" value={mockTest.totalQuestions || 0} />
        <OverviewMetric label="Marks" value={mockTest.totalMarks || 0} />
      </div>
      {sections.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-3">Sections</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sections.map((section) => (
              <div key={section.name} className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                <div className="font-bold text-navy">{section.name}</div>
                <div className="text-xs text-gray-500 mt-1">{section.duration || mockTest.duration || 0} min | {section.totalQuestions || 0} questions</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function OverviewMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
      <div className="text-2xl font-extrabold text-primary">{value}</div>
      <div className="text-xs font-bold text-gray-500 uppercase mt-1">{label}</div>
    </div>
  );
}
