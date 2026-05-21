"use client";
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCertificationsAPI } from "@/services/api";
import { 
  Search, 
  Star, 
  Clock, 
  Award, 
  TrendingUp, 
  ExternalLink, 
  ShieldCheck, 
  ChevronRight,
  GraduationCap
} from "lucide-react";

const categories = ["All", "Data & Analytics", "Cloud Computing", "Web Development", "Project Management", "Finance", "Marketing"];

export default function CertificationsPage() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchCertifications = useCallback(async () => {
    setLoading(true);
    try {
      let params = "";
      const queryParts = [];
      if (search) queryParts.push(`search=${search}`);
      if (selectedCategory !== "All") queryParts.push(`category=${selectedCategory}`);
      
      if (queryParts.length > 0) {
        params = queryParts.join("&");
      }
      
      const { data } = await getCertificationsAPI(params);
      const certsList = data.data || data;
      setCerts(Array.isArray(certsList) ? certsList : []);
    } catch (err) {
      console.error("Failed to fetch certifications:", err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCertifications();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchCertifications]);

  return (
    <main className="bg-gray-50 min-h-screen text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/5 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="px-4 py-1.5 bg-gradient-to-r from-primary/30 to-accent/30 text-white text-xs font-bold rounded-full uppercase tracking-wider mb-6 inline-flex items-center gap-1.5 border border-white/10 backdrop-blur-md">
            <Award className="w-3.5 h-3.5 text-accent animate-pulse" /> Verified Certifications
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Professional <span className="gradient-text">Certifications</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Gain high-demand capabilities, get certified by industry giants like Google, Meta, and AWS, and boost your job prospect metrics.
          </p>
        </div>
      </section>

      {/* Filter and Course Showcase Area */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Filter Layout Bar */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Scrollable Tabs */}
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
              placeholder="Search certifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold transition-all"
            />
          </div>
        </div>

        {/* Dynamic Certification Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4 animate-pulse h-[340px]">
                <div className="h-4 bg-gray-100 rounded w-1/4" />
                <div className="h-6 bg-gray-150 rounded w-3/4" />
                <div className="h-16 bg-gray-50 rounded-2xl" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
                <div className="h-10 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : certs.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200 shadow-xl shadow-gray-100/30">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-navy mb-2">No Certifications Found</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              We couldn't find any courses matching your current filters. Try resetting the search criteria.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="mt-6 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.03] transition-all"
            >
              Show All Courses
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {certs.map((cert) => (
              <div
                key={cert._id}
                className="group bg-white rounded-[2rem] border border-gray-100 p-7 shadow-md hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Category and Rating */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[9px] font-black rounded-full uppercase tracking-wider">
                      {cert.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{cert.rating?.toFixed(1) || "4.5"}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {cert.title}
                  </h3>

                  {/* Provider */}
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">
                    Provider: <span className="text-navy">{cert.instructor}</span>
                  </p>

                  {/* Description */}
                  <p className="text-gray-500 text-xs leading-relaxed mb-6 line-clamp-3">
                    {cert.description || "Transform your professional trajectory by completing this curated masterclass."}
                  </p>

                  {/* Skills Covered */}
                  {cert.skillsCovered && cert.skillsCovered.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Target Skills</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {cert.skillsCovered.slice(0, 4).map((skill: string) => (
                          <span key={skill} className="px-2.5 py-1 bg-gray-50 text-[10px] text-gray-500 font-bold rounded-lg border border-gray-150/40">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  {/* Duration Spec */}
                  <div className="flex items-center gap-2 mb-5 text-[11px] font-bold text-gray-500 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Duration: <strong className="text-navy">{cert.duration}</strong></span>
                  </div>

                  {/* Enroll CTA */}
                  <a
                    href={cert.enrollUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-navy hover:bg-primary text-white rounded-xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-navy/5 hover:shadow-primary/20 transition-all duration-300"
                  >
                    Enroll Now <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Counselor Callout */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold text-navy">Need Custom Study Plans?</h3>
          <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
            Connect with our global education guides. We'll outline which career path certificate matches your specific trajectory.
          </p>
          <div>
            <a
              href="/inquiry"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary to-blue-600 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.03] transition-all uppercase tracking-wider"
            >
              Get Free Career Advice <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
