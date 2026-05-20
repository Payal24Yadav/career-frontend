"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getNewsAPI } from "@/services/api";
import { formatDate } from "@/lib/utils";
import { Calendar, ChevronRight, Bell, Sparkles } from "lucide-react";

export default function AdmissionNews() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configured limit to load exactly 4 items for a perfect 4-column responsive grid
    getNewsAPI("limit=4")
      .then((res) => {
        setNews(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch news:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Pre-defined high-quality fallback updates displayed if database is empty or API fails
  const fallbackNews = [
    {
      _id: "fb-1",
      title: "Universal College Registrations & Entrance Exams Advisory",
      slug: "universal-college-advisory",
      shortDescription: "Official advisory for general registration steps, common entrance exam criteria, and standard scholarship application cycles.",
      isBreakingNews: true,
      publishDate: new Date().toISOString(),
      isFallback: true
    },
    {
      _id: "fb-2",
      title: "Essential Eligibility & Document Verification Checklist",
      slug: "document-verification-checklist",
      shortDescription: "A comprehensive checklist of academic transcripts, test score cards, identification documents, and financial aids paperwork required for 2026.",
      isBreakingNews: false,
      publishDate: new Date().toISOString(),
      isFallback: true
    },
    {
      _id: "fb-3",
      title: "Online Degree Programs Accreditation Guidelines",
      slug: "online-accreditation-guidelines",
      shortDescription: "Learn how to verify UGC-DEB, AICTE, and NAAC approvals before applying for online undergraduate and postgraduate degree courses.",
      isBreakingNews: false,
      publishDate: new Date().toISOString(),
      isFallback: true
    },
    {
      _id: "fb-4",
      title: "Career Mapping and Professional Mentorship Portals",
      slug: "career-mentorship-portals",
      shortDescription: "Get connected with our verified career guidance experts and explore industry-endorsed tracks designed to accelerate placement success.",
      isBreakingNews: false,
      publishDate: new Date().toISOString(),
      isFallback: true
    }
  ];

  if (loading) {
    return (
      <section className="py-12 bg-white relative overflow-hidden border-t border-slate-100">
        {/* Decorative Blurs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Loader */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-6">
            <div className="space-y-3 w-full sm:w-auto">
              <div className="h-6 w-32 skeleton-shimmer rounded-full" />
              <div className="h-10 w-full sm:w-96 skeleton-shimmer rounded-xl" />
              <div className="h-4 w-full sm:w-[500px] skeleton-shimmer rounded-lg" />
            </div>
            <div className="h-11 w-40 skeleton-shimmer rounded-xl shrink-0 hidden sm:block" />
          </div>

          {/* Grid Loader */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-50/70 border border-slate-100 rounded-[2rem] p-6 space-y-5 h-72 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-12 skeleton-shimmer rounded-md" />
                    <div className="h-4 w-24 skeleton-shimmer rounded" />
                  </div>
                  <div className="h-6 w-full skeleton-shimmer rounded-xl mt-6" />
                  <div className="h-6 w-5/6 skeleton-shimmer rounded-xl mt-2" />
                  <div className="space-y-2 pt-4">
                    <div className="h-3 w-full skeleton-shimmer rounded" />
                    <div className="h-3 w-4/5 skeleton-shimmer rounded" />
                  </div>
                </div>
                <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                  <div className="h-4 w-24 skeleton-shimmer rounded" />
                  <div className="h-4 w-4 skeleton-shimmer rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const isFallbackActive = news.length === 0;
  const activeNews = isFallbackActive ? fallbackNews : news;

  // Custom light visual style themes mapped smoothly to each card index
  const cardThemes = [
    { bg: "bg-blue-50/60 hover:bg-blue-100/70 border-blue-100/80", iconBg: "bg-blue-500/10 text-blue-600", text: "group-hover:text-blue-600" },
    { bg: "bg-purple-50/60 hover:bg-purple-100/70 border-purple-100/80", iconBg: "bg-purple-500/10 text-purple-600", text: "group-hover:text-purple-600" },
    { bg: "bg-emerald-50/60 hover:bg-emerald-100/70 border-emerald-100/80", iconBg: "bg-emerald-500/10 text-emerald-600", text: "group-hover:text-emerald-600" },
    { bg: "bg-amber-50/60 hover:bg-amber-100/70 border-amber-100/80", iconBg: "bg-amber-500/10 text-amber-600", text: "group-hover:text-amber-600" }
  ];

  return (
    <section className="py-12 bg-white relative overflow-hidden border-t border-slate-100">
      {/* Decorative Blur Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold tracking-widest text-primary uppercase bg-primary/10 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Admission Alerts
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">
              Admission News & <span className="gradient-text">Entrance Updates</span>
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl text-base leading-relaxed">
              Stay ahead of critical registration deadlines, entrance exams, and official notices from top institutions.
            </p>
          </div>
          <Link 
            href="/news" 
            className="group/btn flex items-center gap-2 bg-navy text-white hover:bg-primary px-5 py-3 rounded-xl text-sm font-semibold shadow-sm transition-all duration-300 shrink-0"
          >
            All News Updates
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Fallback Notice Banner */}
        {isFallbackActive && (
          <div className="mb-8 p-5 bg-blue-50/40 border border-blue-100/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div className="text-center sm:text-left">
                <h4 className="text-sm font-bold text-navy">General Admission Guidelines</h4>
                <p className="text-xs text-gray-500 mt-0.5">We are updating our live database alerts. Displaying general admission preparation advisories in the meantime.</p>
              </div>
            </div>
            <Link 
              href="/news" 
              className="text-xs font-bold text-primary hover:text-navy flex items-center gap-1 shrink-0 bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2 rounded-lg transition-colors"
            >
              Check Updates Board <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Dynamic 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeNews.map((item, index) => {
            const theme = cardThemes[index % cardThemes.length];
            return (
              <Link
                key={item._id}
                href={item.isFallback ? `/news` : `/news/${item.slug}`}
                className={`group flex flex-col justify-between border ${theme.bg} rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg relative overflow-hidden`}
              >
                {/* Breaking/Alert Badge */}
                {item.isBreakingNews && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-4.5 py-1.5 rounded-bl-2xl flex items-center gap-1 shadow-sm">
                    <Bell className="w-3 h-3 animate-bounce" /> Breaking
                  </div>
                )}
                
                <div>
                  {/* Category Indicator & Date */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 ${theme.iconBg} rounded-md text-[10px] uppercase font-bold tracking-wider`}>
                      {item.isFallback ? "Guide" : "Alert"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <time>{formatDate(item.publishDate)}</time>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={`text-lg font-bold text-navy ${theme.text} transition-colors duration-300 leading-snug mb-3 line-clamp-2`}>
                    {item.title}
                  </h3>

                  {/* Description Snippet */}
                  <p className="text-sm text-gray-600/90 leading-relaxed mb-6 line-clamp-3">
                    {item.shortDescription}
                  </p>
                </div>

                {/* Bottom Action Trigger */}
                <div className="pt-4 border-t border-black/5 flex items-center justify-between text-primary font-bold text-xs uppercase tracking-widest group-hover:text-primary/80 transition-colors">
                  <span>{item.isFallback ? "Read Guidelines" : "View Details"}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA Block for Mobile / Emphasis */}
        <div className="mt-12 text-center lg:hidden">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy hover:bg-primary text-white font-semibold text-sm rounded-xl transition-all duration-300 shadow-sm"
          >
            All News Updates
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
