"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getNewsBySlugAPI } from "@/services/api";
import { formatDate } from "@/lib/utils";
import { Calendar, ArrowLeft, Sparkles, Bell } from "lucide-react";

export default function NewsDetailPage() {
  const params = useParams();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.slug) {
      getNewsBySlugAPI(params.slug as string)
        .then((res) => {
          setNews(res.data.data);
        })
        .catch((err) => {
          console.error("Failed to fetch news detail:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [params?.slug]);

  // Premium dynamic JSON Array block rendering, similar to BlogContent.tsx
  const renderBlocks = (blocks: any[]) => {
    if (!blocks || !Array.isArray(blocks)) return null;
    return blocks.map((block, index) => {
      switch (block.type) {
        case 'Heading/Paragraph':
          return (
            <div key={index} className="mb-10">
              {block.sectionHeading && (
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-14 mb-6 pb-3 border-b-2 border-slate-100 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text block">
                  {block.sectionHeading}
                </h2>
              )}
              {block.sectionParagraph && (
                <p className="text-slate-600 font-normal text-base sm:text-lg leading-[1.9] mb-6">
                  {block.sectionParagraph}
                </p>
              )}
            </div>
          );
        
        case 'Bullet Points List':
          return (
            <ul key={index} className="my-6 space-y-3.5 pl-0 list-none">
              {block.listItems?.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 font-medium text-base sm:text-lg">
                  <span className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );

        default:
          return null;
      }
    });
  };

  if (loading) {
    return (
      <main className="bg-[#f8fafc] min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 pt-48 pb-20">
          <div className="h-6 w-32 bg-slate-200 animate-pulse rounded-lg mb-8" />
          <div className="h-16 w-3/4 bg-slate-200 animate-pulse rounded-xl mb-6" />
          <div className="h-6 w-48 bg-slate-200 animate-pulse rounded-lg mb-12" />
          <div className="space-y-4">
            <div className="h-4 bg-slate-200 animate-pulse rounded-lg" />
            <div className="h-4 bg-slate-200 animate-pulse rounded-lg w-5/6" />
            <div className="h-4 bg-slate-200 animate-pulse rounded-lg w-2/3" />
          </div>
        </div>
      </main>
    );
  }

  if (!news) {
    return (
      <main className="bg-[#f8fafc] min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 pt-48 pb-20 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-4">News Item Not Found</h2>
          <p className="text-slate-500 mb-8">The requested announcement might have been updated or removed.</p>
          <Link href="/news" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to News list
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f8fafc] min-h-screen overflow-hidden antialiased">
      <Navbar />

      <section className="relative pt-36 lg:pt-48 pb-20 bg-white border-b border-slate-200/60">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_0.05rem,transparent_0.05rem)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors group mb-10"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to All updates
          </Link>

          <div className="flex flex-wrap items-center gap-y-4 gap-x-6 mb-8">
            <span className="px-4 py-1.5 rounded-md bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> Admission Update
            </span>
            {news.isBreakingNews && (
              <span className="px-4 py-1.5 rounded-md bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-sm flex items-center gap-1">
                <Bell className="w-3 h-3 animate-bounce" /> Breaking
              </span>
            )}
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{formatDate(news.publishDate)}</span>
            </div>
          </div>

          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8 font-sans">
              {news.title}
            </h1>
            <p className="text-lg sm:text-xl text-slate-500 font-normal leading-relaxed max-w-4xl border-l-2 border-slate-200 pl-6 py-1">
              {news.shortDescription}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200/70 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.02)] p-6 sm:p-12 lg:p-16">
            <article className="max-w-none">
              {Array.isArray(news.fullContent) ? (
                renderBlocks(news.fullContent)
              ) : (
                <p className="text-slate-600 font-normal text-base sm:text-lg leading-[1.9] mb-6">
                  {news.fullContent}
                </p>
              )}
            </article>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
