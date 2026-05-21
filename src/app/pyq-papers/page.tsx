"use client";
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPYQsAPI } from "@/services/api";
import { 
  Search, 
  SlidersHorizontal, 
  FileText, 
  Calendar, 
  Clock, 
  Download, 
  BookOpen,
  Award,
  Sparkles,
  ChevronRight
} from "lucide-react";

const exams = ["All", "CAT", "NMAT", "XAT", "JEE Main", "JEE Advanced", "NEET"];
const difficulties = ["All", "Easy", "Medium", "Hard"];
const years = ["All", "2024", "2023", "2022"];

export default function PYQPapersPage() {
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [search, setSearch] = useState("");
  const [selectedExam, setSelectedExam] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  const fetchPapers = useCallback(async () => {
    setLoading(true);
    try {
      let params = "";
      const queryParts = [];
      if (search) queryParts.push(`search=${search}`);
      if (selectedExam !== "All") queryParts.push(`exam=${selectedExam}`);
      if (selectedDifficulty !== "All") queryParts.push(`difficulty=${selectedDifficulty}`);
      if (selectedYear !== "All") queryParts.push(`year=${selectedYear}`);
      
      if (queryParts.length > 0) {
        params = queryParts.join("&");
      }
      
      const { data } = await getPYQsAPI(params);
      // Backend controller returns `{ success: true, data: [...] }` or just list
      const papersList = data.data || data;
      setPapers(Array.isArray(papersList) ? papersList : []);
    } catch (err) {
      console.error("Failed to fetch PYQs:", err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedExam, selectedDifficulty, selectedYear]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPapers();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchPapers]);

  return (
    <main className="bg-gray-50 min-h-screen text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/5 to-transparent" />
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="px-4 py-1.5 bg-gradient-to-r from-primary/30 to-accent/30 text-white text-xs font-bold rounded-full uppercase tracking-wider mb-6 inline-flex items-center gap-1.5 border border-white/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" /> 100% Free Resources
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Previous Year <span className="gradient-text">Question Papers</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Boost your exam prep with authentic, fully solved previous year papers from top national level exams.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-28 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-8">
              <div>
                <h3 className="text-lg font-extrabold text-navy mb-5 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-primary" /> Filter Options
                </h3>
                
                {/* Search Bar */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search papers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                  />
                </div>

                <div className="space-y-6">
                  {/* Exam Filter */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Exam Board</h4>
                    <div className="flex flex-wrap gap-2">
                      {exams.map((exam) => (
                        <button
                          key={exam}
                          onClick={() => setSelectedExam(exam)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            selectedExam === exam
                              ? "bg-primary text-white shadow-md shadow-primary/25"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {exam}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Year Filter */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Year</h4>
                    <div className="flex flex-wrap gap-2">
                      {years.map((year) => (
                        <button
                          key={year}
                          onClick={() => setSelectedYear(year)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            selectedYear === year
                              ? "bg-navy text-white shadow-md shadow-navy/25"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Difficulty Level</h4>
                    <div className="flex flex-wrap gap-2">
                      {difficulties.map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setSelectedDifficulty(diff)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            selectedDifficulty === diff
                              ? "bg-accent text-white shadow-md shadow-accent/25"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Helper Banner */}
              <div className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-primary/10 relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
                <h4 className="font-bold text-navy mb-1.5 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-primary" /> Target 2026?
                </h4>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Unlock access to the latest free mock exams patterned after standard tests.
                </p>
                <a
                  href="/mock-tests"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
                >
                  Explore Mocks <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </aside>

          {/* Main Paper Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4 animate-pulse">
                    <div className="h-6 bg-gray-150 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-10 bg-gray-50 rounded-xl" />
                      <div className="h-10 bg-gray-50 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : papers.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200 shadow-xl shadow-gray-100/30">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-navy mb-2">No Papers Found</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  We couldn't find any papers matching your selection. Try clearing your filters or choosing another category.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedExam("All");
                    setSelectedDifficulty("All");
                    setSelectedYear("All");
                  }}
                  className="mt-6 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.03] transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {papers.map((paper) => (
                  <div
                    key={paper._id}
                    className="group bg-white rounded-3xl border border-gray-100 p-6 shadow-md hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Badge / Meta */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          paper.exam === "CAT" || paper.exam === "XAT" || paper.exam === "NMAT"
                            ? "bg-rose-50 text-rose-500 border border-rose-100"
                            : "bg-cyan-50 text-cyan-600 border border-cyan-100"
                        }`}>
                          {paper.exam}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{paper.year}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-navy mb-2.5 group-hover:text-primary transition-colors line-clamp-2">
                        {paper.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-500 text-xs leading-relaxed mb-6 line-clamp-2">
                        {paper.description || `${paper.exam} question paper from the year ${paper.year}.`}
                      </p>
                    </div>

                    <div>
                      {/* Specs Row */}
                      <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-gray-50 rounded-2xl mb-5 text-[11px] text-gray-500 font-semibold">
                        <div className="flex flex-col items-center justify-center border-r border-gray-200/60">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Questions</span>
                          <span className="text-navy font-bold">{paper.totalQuestions || "N/A"}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center border-r border-gray-200/60">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Duration</span>
                          <span className="text-navy font-bold">{paper.duration} min</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Difficulty</span>
                          <span className={`font-bold ${
                            paper.difficulty === "Easy"
                              ? "text-emerald-500"
                              : paper.difficulty === "Hard"
                              ? "text-rose-500"
                              : "text-amber-500"
                          }`}>{paper.difficulty || "Medium"}</span>
                        </div>
                      </div>

                      {/* Download Button */}
                      <a
                        href={paper.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 bg-navy hover:bg-primary text-white rounded-xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-navy/10 hover:shadow-primary/20 transition-all duration-300"
                      >
                        <Download className="w-4 h-4" /> Download solved PDF
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
