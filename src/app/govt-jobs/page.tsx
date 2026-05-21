"use client";
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getGovtJobsAPI } from "@/services/api";
import { 
  Search, 
  Briefcase, 
  Calendar, 
  FileText, 
  ExternalLink, 
  IndianRupee, 
  AlertCircle,
  Sparkles,
  ChevronRight
} from "lucide-react";

const categories = ["All", "UPSC", "SSC", "Banking", "Railway", "Defense", "State Jobs"];

export default function GovtJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      let params = "";
      const queryParts = [];
      if (search) queryParts.push(`search=${search}`);
      if (selectedCategory !== "All") queryParts.push(`category=${selectedCategory}`);
      
      if (queryParts.length > 0) {
        params = queryParts.join("&");
      }
      
      const { data } = await getGovtJobsAPI(params);
      const jobsList = data.data || data;
      setJobs(Array.isArray(jobsList) ? jobsList : []);
    } catch (err) {
      console.error("Failed to fetch government jobs:", err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  // Formatter for Date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  // Helper to check if deadline is near (under 15 days) or already passed
  const getDeadlineStatus = (lastDateStr: string) => {
    if (!lastDateStr) return { label: "Active", style: "bg-emerald-50 text-emerald-600 border-emerald-100" };
    
    const today = new Date();
    const lastDate = new Date(lastDateStr);
    const timeDiff = lastDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) {
      return { label: "Expired", style: "bg-gray-100 text-gray-500 border-gray-200" };
    }
    if (daysDiff <= 15) {
      return { label: `Closing in ${daysDiff} days`, style: "bg-rose-50 text-rose-500 border-rose-100 font-extrabold animate-pulse" };
    }
    return { label: "Active", style: "bg-emerald-50 text-emerald-600 border-emerald-100" };
  };

  return (
    <main className="bg-gray-50 min-h-screen text-gray-800">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-32 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/5 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="px-4 py-1.5 bg-gradient-to-r from-primary/30 to-accent/30 text-white text-xs font-bold rounded-full uppercase tracking-wider mb-6 inline-flex items-center gap-1.5 border border-white/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" /> Daily Job Alerts
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Government <span className="gradient-text">Job Board</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Stay ahead with authentic, live notifications from UPSC, SSC, Banks, Railways, and Defense boards. Instant PDF alerts & application links.
          </p>
        </div>
      </section>

      {/* Main Alert List */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Filters Panel */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Scrollable Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-3 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold transition-all"
            />
          </div>
        </div>

        {/* Listings Board */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4 animate-pulse h-48" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200 shadow-xl shadow-gray-100/30">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-navy mb-2">No Active Notifications</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              We couldn't find any job notifications matching your current filters. Try checking other boards.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="mt-6 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.03] transition-all"
            >
              Reset Search Filter
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => {
              const deadline = getDeadlineStatus(job.lastDate);
              return (
                <div
                  key={job._id}
                  className="group bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-md hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  {/* Job Primary Details */}
                  <div className="space-y-3.5 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Category */}
                      <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[9px] font-black rounded-full uppercase tracking-wider">
                        {job.category}
                      </span>
                      {/* Status */}
                      <span className={`px-3 py-1 border text-[9px] font-black rounded-full uppercase tracking-wider ${deadline.style}`}>
                        {deadline.label}
                      </span>
                    </div>

                    <div>
                      {/* Title */}
                      <h3 className="text-xl font-bold text-navy group-hover:text-primary transition-colors leading-tight">
                        {job.title}
                      </h3>
                      {/* Department */}
                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1">
                        {job.department}
                      </p>
                    </div>

                    {/* Meta Specs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-gray-500 font-semibold max-w-xl">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-emerald-500" />
                        <span>Package: <strong className="text-navy">{job.salary || "As per Rules"}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-accent" />
                        <span className="line-clamp-1">Eligibility: <strong className="text-navy">{job.eligibility}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-500" />
                        <span>Apply By: <strong className="text-rose-500">{formatDate(job.lastDate)}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 w-full md:w-auto flex-shrink-0">
                    {/* PDF Notification */}
                    {job.notificationPdfUrl && (
                      <a
                        href={job.notificationPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-5 border border-gray-200 hover:border-rose-500 hover:bg-rose-50/20 text-gray-600 hover:text-rose-500 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <FileText className="w-4 h-4" /> Download PDF
                      </a>
                    )}
                    
                    {/* Apply Link */}
                    {job.applyUrl && (
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-6 bg-navy hover:bg-primary text-white rounded-xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-navy/5 hover:shadow-primary/20 transition-all duration-300"
                      >
                        Apply Online <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Advisory Note */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-black rounded-full uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" /> Authentic Sources
          </div>
          <h3 className="text-xl font-bold text-navy">Board Recruitment Advisory</h3>
          <p className="text-gray-500 text-xs max-w-2xl mx-auto leading-relaxed">
            Note: All notifications, admit cards, and results are indexed strictly from government gazettes and recruitment board channels (UPSC, NTA, RRB, IBPS). Candidates are advised to cross-verify specific details on official agency portals.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
