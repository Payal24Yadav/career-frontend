"use client";
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgramCard from "@/components/ProgramCard";
import ProgramModal from "@/components/ProgramModal";
import { getProgramsAPI } from "@/services/api";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, BookOpen, GraduationCap, Briefcase, Clock, ShieldCheck, Star } from "lucide-react";

const courseTypes = ["MBA", "BBA", "MCA", "BCA", "Data Science", "AI & ML", "Digital Marketing"];
const grades = ["A++", "A+", "A", "B++"];
const durations = ["6 Months", "1 Year", "2 Years", "3 Years"];

const whyChooseData = [
  { icon: Clock, title: "Flexible Learning", desc: "Balance work and study with 100% online coursework." },
  { icon: IndianRupee, title: "Affordable Fees", desc: "Quality education at a fraction of on-campus costs." },
  { icon: TrendingUp, title: "Career Growth", desc: "Boost your credentials while staying in your job." },
  { icon: Briefcase, title: "Industry Recognized", desc: "UGC-DEB approved degrees from top universities." },
  { icon: ShieldCheck, title: "Accredited Programs", desc: "Degrees with NAAC A+ and international rankings." },
  { icon: GraduationCap, title: "Remote Access", desc: "Learn from anywhere with world-class digital LMS." }
];

import { IndianRupee, TrendingUp } from "lucide-react";

export default function OnlineDegreePage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({});
  
  // Modal State
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [courseType, setCourseType] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      let params = `page=${page}&limit=9&sort=${sortBy}`;
      if (search) params += `&search=${search}`;
      if (courseType) params += `&courseType=${courseType}`;
      if (selectedGrade) params += `&grade=${selectedGrade}`;
      if (selectedDuration) params += `&duration=${selectedDuration}`;

      const { data } = await getProgramsAPI(params);
      setPrograms(data.data);
      setPagination(data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, search, courseType, selectedGrade, selectedDuration, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => fetchPrograms(), 500);
    return () => clearTimeout(timer);
  }, [fetchPrograms]);

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="px-4 py-1.5 bg-white/10 text-primary text-xs font-bold rounded-full uppercase tracking-widest mb-6 inline-block backdrop-blur-sm border border-white/5">Admissions Open 2026</span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight">
            Online Degree & <span className="gradient-text">Certification</span> Programs
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Explore UGC-approved online degrees, certifications, and career-focused programs from top-tier universities worldwide.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-10 py-5 bg-primary text-white font-bold rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.05] transition-all">Explore Programs</button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all backdrop-blur-md">Get Free Counseling</button>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">Why Choose an Online Degree in 2026?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Modern education designed for professional growth and flexibility.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyChooseData.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group">
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Listings & Filters */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="sticky top-24 space-y-10">
                <div>
                  <h3 className="text-xl font-bold text-navy mb-6 flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-primary" /> Filters
                  </h3>
                  <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search programs..." 
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    />
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Course Category</h4>
                      <div className="flex flex-wrap gap-2">
                        {courseTypes.map(type => (
                          <button 
                            key={type}
                            onClick={() => setCourseType(courseType === type ? "" : type)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${courseType === type ? "bg-primary text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">University Grade</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {grades.map(grade => (
                          <button 
                            key={grade}
                            onClick={() => setSelectedGrade(selectedGrade === grade ? "" : grade)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedGrade === grade ? "bg-navy text-white border-navy" : "bg-white text-gray-600 border-gray-100 hover:border-primary"}`}
                          >
                            {grade}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Duration</h4>
                      <div className="space-y-2">
                        {durations.map(dur => (
                          <label key={dur} className="flex items-center gap-2 cursor-pointer group">
                            <input type="radio" checked={selectedDuration === dur} onChange={() => setSelectedDuration(dur)} className="w-4 h-4 text-primary border-gray-200" />
                            <span className="text-sm text-gray-600 group-hover:text-navy transition-colors">{dur}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                  <h4 className="font-bold text-navy mb-2">Need Help?</h4>
                  <p className="text-xs text-gray-500 mb-4">Talk to our career experts for free program advice.</p>
                  <button className="w-full py-2.5 bg-navy text-white text-[10px] font-bold rounded-xl uppercase tracking-widest">Connect Now</button>
                </div>
              </div>
            </aside>

            {/* Main Listing Area */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-bold text-navy">{programs.length}</span> programs
                </div>
                <select 
                  value={sortBy} 
                  onChange={e => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-navy focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="fees">Lowest Fees</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>

              {loading ? (
                <div className="grid sm:grid-cols-2 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-80 bg-gray-50 rounded-3xl animate-pulse" />
                  ))}
                </div>
              ) : programs.length === 0 ? (
                <div className="py-20 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-navy mb-2">No Programs Found</h3>
                  <p className="text-gray-500 text-sm">Try adjusting your filters or search query.</p>
                  <button onClick={() => { setSearch(""); setCourseType(""); setSelectedGrade(""); setSelectedDuration(""); }} className="mt-6 text-primary font-bold hover:underline">Clear all filters</button>
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 gap-8">
                    {programs.map(program => (
                      <ProgramCard 
                        key={program._id} 
                        program={program} 
                        onViewDetails={(p) => { setSelectedProgram(p); setIsModalOpen(true); }}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-4">
                      <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-3 border rounded-2xl disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
                      <span className="text-sm font-bold">Page {page} of {pagination.pages}</span>
                      <button disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)} className="p-3 border rounded-2xl disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Program Modal */}
      <ProgramModal 
        isOpen={isModalOpen} 
        program={selectedProgram} 
        onClose={() => setIsModalOpen(false)} 
      />

      <Footer />
    </main>
  );
}
