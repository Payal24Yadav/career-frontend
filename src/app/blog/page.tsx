"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBlogsAPI } from "@/services/api";
import { formatDate, truncate } from "@/lib/utils";
import { Search, Calendar, Tag, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface Blog { _id: string; title: string; slug: string; description: string; category: string; thumbnailUrl: string; author: string; publishedDate: string; }
interface Pagination { page: number; pages: number; total: number; }

const categories = ["All", "MBA", "Engineering", "Medical", "Law", "Career Tips", "Exam Updates", "Study Abroad", "General"];

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pages: 1, total: 0 });

  const fetchBlogs = async (page = 1) => {
    setLoading(true);
    try {
      let params = `page=${page}&limit=9`;
      if (search) params += `&search=${search}`;
      if (category !== "All") params += `&category=${category}`;
      const { data } = await getBlogsAPI(params);
      setBlogs(data.data);
      setPagination(data.pagination);
    } catch { setBlogs([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchBlogs(); }, [category]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchBlogs(); };

  return (
    <main>
      <Navbar />
      <section className="pt-24 pb-8 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">Our <span className="gradient-text">Blog</span></h1>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">Stay updated with latest news on admissions, exams, career tips, and more.</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </form>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${category === c ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden"><div className="h-52 skeleton-shimmer" /><div className="pt-5 space-y-3"><div className="h-4 w-1/3 skeleton-shimmer rounded" /><div className="h-6 w-full skeleton-shimmer rounded" /><div className="h-4 w-2/3 skeleton-shimmer rounded" /></div></div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20"><p className="text-gray-500 text-lg">No articles found.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link key={blog._id} href={`/blog/${blog.slug}`} className="group">
                  <div className="rounded-2xl overflow-hidden">
                    {/* <div className="relative h-52 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5">
                      {blog.thumbnailUrl ? <img src={blog.thumbnailUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> :
                        <div className="w-full h-full flex items-center justify-center"><span className="text-5xl font-bold text-primary/20">{blog.title.charAt(0)}</span></div>}
                    </div> */}
                    <div className="pt-5">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{blog.category}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(blog.publishedDate)}</span>
                      </div>
                      <h3 className="text-lg font-bold text-navy group-hover:text-primary transition-colors leading-tight mb-2">{blog.title}</h3>
                      <p className="text-sm text-gray-500">{truncate(blog.description, 120)}</p>
                      <span className="inline-flex items-center gap-1 text-sm text-primary font-semibold mt-3 group-hover:gap-2 transition-all">Read More <ArrowRight className="w-4 h-4" /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button onClick={() => fetchBlogs(pagination.page - 1)} disabled={pagination.page === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"><ChevronLeft className="w-5 h-5" /></button>
              {[...Array(pagination.pages)].map((_, i) => (
                <button key={i} onClick={() => fetchBlogs(i + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium ${pagination.page === i + 1 ? "bg-primary text-white" : "border border-gray-200 hover:bg-gray-50"}`}>{i + 1}</button>
              ))}
              <button onClick={() => fetchBlogs(pagination.page + 1)} disabled={pagination.page === pagination.pages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"><ChevronRight className="w-5 h-5" /></button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
