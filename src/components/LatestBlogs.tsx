"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { getBlogsAPI } from "@/services/api";
import { formatDate, truncate } from "@/lib/utils";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  author: string;
  publishedDate: string;
}

export default function LatestBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await getBlogsAPI("limit=4"); // Adjusted limit slightly to match a full 4-column row layout perfectly
        setBlogs(data.data);
      } catch {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Pre-defined light, playful color variants mapped by card index
  const cardStyles = [
    { bg: "bg-blue-50/70 hover:bg-blue-100/80 border-blue-100", badge: "bg-blue-500/10 text-blue-700", text: "group-hover:text-blue-600" },
    { bg: "bg-emerald-50/70 hover:bg-emerald-100/80 border-emerald-100", badge: "bg-emerald-500/10 text-emerald-700", text: "group-hover:text-emerald-600" },
    { bg: "bg-purple-50/70 hover:bg-purple-100/80 border-purple-100", badge: "bg-purple-500/10 text-purple-700", text: "group-hover:text-purple-600" },
    { bg: "bg-amber-50/70 hover:bg-amber-100/80 border-amber-100", badge: "bg-amber-500/10 text-amber-700", text: "group-hover:text-amber-600" }
  ];

  return (
    <section className="py-7 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-6">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest text-primary uppercase bg-primary/10 rounded-full mb-3">
              Latest Articles
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">
              From Our <span className="gradient-text">Blog</span>
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl text-base leading-relaxed">
              Stay updated with the latest news on admissions, exams, and careers.
            </p>
          </div>
          <Link href="/blog" className="group/btn flex items-center gap-2 bg-navy text-white hover:bg-primary px-5 py-3 rounded-xl text-sm font-semibold shadow-sm transition-all duration-300">
            View All Articles 
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading State Grid (4 Columns) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex gap-4">
                  <div className="h-4 w-1/3 skeleton-shimmer rounded" />
                </div>
                <div className="h-6 w-full skeleton-shimmer rounded mt-2" />
                <div className="space-y-2 pt-1">
                  <div className="h-4 w-full skeleton-shimmer rounded" />
                  <div className="h-4 w-5/6 skeleton-shimmer rounded" />
                </div>
                <div className="h-4 w-1/3 skeleton-shimmer rounded pt-4" />
              </div>
            ))}
          </div>
        ) : (
          /* Active Content Grid (4 Columns) */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {blogs.map((blog, index) => {
              // Cycle through the 4 vibrant style sets smoothly based on current item index
              const style = cardStyles[index % cardStyles.length];

              return (
                <Link 
                  key={blog._id} 
                  href={`/blog/${blog.slug}`} 
                  className={`group flex flex-col h-full border ${style.bg} rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg`}
                >
                  {/* Category & Metadata Pill */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-gray-400 mb-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${style.badge} rounded-xl transition-colors duration-300`}>
                      <Tag className="w-3 h-3" />
                      {blog.category}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <time>{formatDate(blog.publishedDate)}</time>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={`text-lg font-bold text-navy ${style.text} transition-colors duration-300 leading-snug mb-3 line-clamp-2`}>
                    {blog.title}
                  </h3>
                  
                  {/* Description Snippet */}
                  <p className="text-sm text-gray-600/90 leading-relaxed mb-6 line-clamp-3">
                    {truncate(blog.description, 120)}
                  </p>
                  
                  {/* Bottom Action Indicator */}
                  <div className="mt-auto pt-4 border-t border-black/5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-sm text-primary font-bold group-hover:gap-3 transition-all duration-300">
                      Read Article 
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>

                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}