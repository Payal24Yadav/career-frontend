"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatDate } from "@/lib/utils";

import {
  ArrowLeft,
  Calendar,
  User,
  MessageCircle,
  PhoneCall,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

interface RelatedBlog {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  publishDate: string;
  publishedDate?: string;
}

interface Blog {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: any; // Updated from string to any to handle both legacy HTML and new Array of blocks
  category: string;
  author: string;
  publishDate: string;
  publishedDate?: string;
  tags?: string[];
  relatedBlogs?: RelatedBlog[];
}

export default function BlogContent({ blog }: { blog: Blog }) {
  
  // HTML TAGS KE ANDAR STRONG TAILWIND STYLING AUTOMATICALLY FORWARD KARNE KA FUNCTION (LEGACY SUPPORT)
  const injectUniqueTailwindStyles = (htmlContent: string) => {
    if (!htmlContent) return "";

    let stylizedHTML = htmlContent;

    // 1. HEADINGS (H2) STYLING: Adding distinct gradients and spacing wrappers
    stylizedHTML = stylizedHTML.replace(
      /<h2>(.*?)<\/h2>/g,
      `<h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-14 mb-6 pb-3 border-b-2 border-slate-100 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text block">$1</h2>`
    );

    // 2. STANDARD PARAGRAPHS STYLING
    stylizedHTML = stylizedHTML.replace(
      /<p>(.*?)<\/p>/g,
      `<p class="text-slate-600 font-normal text-base sm:text-lg leading-[1.9] mb-6">$1</p>`
    );

    // 3. UNORDERED LISTS CONTAINER STYLING
    stylizedHTML = stylizedHTML.replace(
      /<ul>/g,
      `<ul class="my-6 space-y-3.5 pl-0 list-none">`
    );

    // 4. LIST ITEMS WITH CUSTOM BULLET ICONS STYLING
    stylizedHTML = stylizedHTML.replace(
      /<li>(.*?)<\/li>/g,
      `<li class="flex items-start gap-3 text-slate-600 font-medium text-base sm:text-lg"><span class="w-2 h-2 rounded-full bg-blue-600 mt-2.5 shrink-0"></span><span>$1</span></li>`
    );

    // 5. PREMIUM WRAPPED DATA TABLES STYLING
    stylizedHTML = stylizedHTML.replace(
      /<table>/g,
      `<div class="my-8 overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm"><div class="overflow-x-auto"><table class="w-full border-collapse text-left m-0">`
    );
    stylizedHTML = stylizedHTML.replace(/<\/table>/g, `</table></div></div>`);

    // 6. THEAD STYLING
    stylizedHTML = stylizedHTML.replace(
      /<thead>/g,
      `<thead class="bg-slate-900 text-white">`
    );

    // 7. TABLE HEADERS (TH) STYLING
    stylizedHTML = stylizedHTML.replace(
      /<th>(.*?)<\/th>/g,
      `<th class="p-4 text-xs font-black uppercase tracking-widest text-white">$1</th>`
    );

    // 8. TABLE DATA CELLS (TD) STYLING
    stylizedHTML = stylizedHTML.replace(
      /<td>(.*?)<\/td>/g,
      `<td class="p-4 border-t border-slate-100 text-sm text-slate-600 bg-white font-medium">$1</td>`
    );

    // Specific highlight for university column items inside rows
    stylizedHTML = stylizedHTML.replace(
      /<td>([A-Za-z\s]+ University|SUNY [A-Za-z\s]+)<\/td>/g,
      `<td class="p-4 border-t border-slate-100 text-sm font-bold text-slate-900 bg-white">$1</td>`
    );

    return stylizedHTML;
  };

  // NEW JSON ARRAY RENDERER
  const renderBlocks = (blocks: any[]) => {
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

        case 'Data Table':
          return (
            <div key={index} className="my-8 overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left m-0">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      {block.tableData?.headers?.map((header: string, i: number) => (
                        <th key={i} className="p-4 text-xs font-black uppercase tracking-widest text-white">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-600 bg-white">
                    {block.tableData?.rows?.map((row: string[], rIndex: number) => (
                      <tr key={rIndex} className="hover:bg-slate-50/80 transition-colors">
                        {row.map((cell: string, cIndex: number) => {
                          const isUniversity = cell.toLowerCase().includes('university') || cell.toLowerCase().includes('suny');
                          return (
                            <td key={cIndex} className={`p-4 font-medium ${isUniversity ? 'font-bold text-slate-900' : ''}`}>
                              {cell}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );

        default:
          return null;
      }
    });
  };

  return (
    <main className="bg-[#f8fafc] min-h-screen overflow-hidden antialiased">
      <Navbar />

      {/* ===================================================== */}
      {/* HERO SECTION */}
      {/* ===================================================== */}
      <section className="relative pt-36 lg:pt-48 pb-20 bg-white border-b border-slate-200/60">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_0.05rem,transparent_0.05rem)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors group mb-10"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>

          <div className="flex flex-wrap items-center gap-y-4 gap-x-6 mb-8">
            <span className="px-4 py-1.5 rounded-md bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              {blog.category}
            </span>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{formatDate(blog.publishDate || blog.publishedDate || new Date().toISOString())}</span>
            </div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <User className="w-4 h-4 text-slate-400" />
              <span>By {blog.author}</span>
            </div>
          </div>

          <div className="max-w-5xl">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08] mb-8 font-sans">
              {blog.title}
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-500 font-normal leading-relaxed max-w-4xl border-l-2 border-slate-200 pl-6 py-1">
              {blog.description}
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* MAIN CONTENT SECTION */}
      {/* ===================================================== */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* LEFT COLUMN CONTAINER */}
            <div className="lg:col-span-8 space-y-16">
              <div className="bg-white rounded-[2.5rem] border border-slate-200/70 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.02)] p-6 sm:p-12 lg:p-16">
                
                {/* PARSED OUTPUT ROW WITH RE-ENGINEERED TAILWIND DESIGN */}
                <article className="max-w-none">
                  {Array.isArray(blog.content) ? (
                    renderBlocks(blog.content)
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: injectUniqueTailwindStyles(blog.content) }} />
                  )}
                </article>

                {/* TAGS FOOTER ROW */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-16 pt-8 border-t border-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-900 mr-2">
                        Tags:
                      </span>
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-900 hover:text-white transition-all text-xs font-bold text-slate-500 cursor-default border border-slate-200/60"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RELATED ARTICLES ROW */}
              {blog.relatedBlogs && blog.relatedBlogs.length > 0 && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Related Articles
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {blog.relatedBlogs.map((related) => (
                      <Link
                        key={related._id}
                        href={`/blog/${related.slug}`}
                        className="group bg-white border border-slate-200/70 rounded-[2rem] p-6 hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
                      >
                        <div>
                          <span className="inline-flex px-2.5 py-1 bg-slate-100 text-slate-800 text-[9px] font-black uppercase tracking-widest rounded-md mb-4">
                            {related.category}
                          </span>
                          <h3 className="text-lg font-extrabold text-slate-900 leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {related.title}
                          </h3>
                          <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                            {related.description}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-primary font-bold text-xs">
                          <span>Read Article</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR COLUMN CONTAINER */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
              
              {/* PRIMARY CTA CONVERSION CARD */}
              <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.03)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-6 shadow-sm">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight mb-3">
                  Get Free Recommendations
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Talk to expert counselors and discover the best colleges,
                  universities, and career opportunities based on your profile.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/inquiry"
                    className="flex items-center justify-center gap-2 w-full py-4 px-4 rounded-xl bg-slate-900 text-white text-xs uppercase tracking-wider font-black hover:bg-primary transition-all shadow-sm"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Book Free Consultation
                  </Link>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 px-4 rounded-xl bg-[#25D366]/10 text-[#25D366] text-xs uppercase tracking-wider font-black hover:bg-[#25D366] hover:text-white transition-all border border-[#25D366]/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Expert
                  </a>
                </div>
              </div>

              {/* SIDEBAR BENCHMARK DETAILS CARD */}
              <div className="bg-slate-900 text-white rounded-[2.5rem] p-6 sm:p-8 shadow-sm">
                <h4 className="text-sm uppercase tracking-[0.2em] font-black text-slate-400 mb-6">
                  Why Choose Us?
                </h4>
                <ul className="space-y-4">
                  {[
                    "10+ Years Experience",
                    "50+ Partner Colleges",
                    "98% Admission Success",
                    "Personalized Guidance",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-sm text-slate-200 font-medium"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BOTTOM CONVERSION PROMPTER BLOCK */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,#ffffff_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-6 tracking-tight">
            Dominate Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              2026 Goals
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Stop guessing. Get personalized admission strategies and expert
            counseling to secure your dream college and career path.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
            <Link
              href="/inquiry"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all text-xs uppercase tracking-wider text-center shadow-lg shadow-primary/20"
            >
              Start Your Journey
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all text-xs uppercase tracking-wider text-center"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}