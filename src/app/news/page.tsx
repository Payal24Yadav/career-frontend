"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getNewsAPI } from "@/services/api";
import { formatDate } from "@/lib/utils";
import { Calendar, ChevronRight, Bell, Sparkles } from "lucide-react";

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewsAPI()
      .then((res) => {
        setNews(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch news listing:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="bg-[#f8fafc] min-h-screen overflow-hidden antialiased">
      <Navbar />

      <section className="relative pt-36 lg:pt-48 pb-20 bg-white border-b border-slate-200/60">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_0.05rem,transparent_0.05rem)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3 animate-spin" /> Live Alerts 2026
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6 font-sans">
            Latest Admission News & <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Entrance Updates 2026</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 max-w-3xl leading-relaxed">
            Real-time coverage of entrance exams, admissions, criteria changes, registration notifications, and vital updates from global education authorities.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 bg-slate-200 animate-pulse rounded-[2.5rem]" />
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200/60 rounded-[2.5rem] p-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Updates Posted Yet</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              We are constantly monitoring updates. Stay tuned, new alerts will appear here as soon as they are announced!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <Link
                key={item._id}
                href={`/news/${item.slug}`}
                className="group bg-white border border-slate-200/70 rounded-[2.5rem] p-8 hover:shadow-2xl hover:border-blue-500/30 transition-all duration-500 flex flex-col justify-between relative overflow-hidden"
              >
                {item.isBreakingNews && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl flex items-center gap-1">
                    <Bell className="w-3 h-3 animate-bounce" /> Breaking
                  </div>
                )}
                
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 font-bold mb-6">
                    <Calendar className="w-4 h-4 text-slate-300" />
                    <span>{formatDate(item.publishDate)}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 leading-snug mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3">
                    {item.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-blue-600 font-black text-xs uppercase tracking-widest group-hover:text-indigo-600 transition-colors">
                  <span>Read Full Update</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
