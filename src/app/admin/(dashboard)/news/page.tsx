"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getNewsAPI, deleteNewsAPI } from "@/services/api";
import { formatDate } from "@/lib/utils";
import { Plus, Edit, Trash2, Search, Bell, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminNewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({});

  const fetchNews = async (p = 1) => {
    setLoading(true);
    try {
      let params = `page=${p}&limit=10`;
      if (search) params += `&search=${search}`;
      const { data } = await getNewsAPI(params);
      setNews(data.data || []);
      setPagination(data.pagination || {});
      setPage(p);
    } catch (err: any) {
      toast.error("Failed to fetch news updates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news article?")) return;
    const loadId = toast.loading("Deleting news article...");
    try {
      await deleteNewsAPI(id);
      toast.success("News article deleted successfully", { id: loadId });
      // Optimistic update
      setNews((prev) => prev.filter((item) => item._id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete news article", { id: loadId });
      fetchNews(page);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
          <Bell className="w-6 h-6 text-primary" /> News Management
        </h1>
        <Link
          href="/admin/news/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-md shadow-primary/10"
        >
          <Plus className="w-4 h-4" /> Add News Article
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search news..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchNews()}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title / Slug</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Publish Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-4 bg-slate-100 animate-pulse rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : news.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">
                    No news articles found
                  </td>
                </tr>
              ) : (
                news.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-navy text-sm max-w-sm truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-400">/{item.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-primary/5 text-primary text-xs rounded-lg font-medium">
                        {item.category || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.author || "Admin"}</td>
                    <td className="px-6 py-4">
                      {item.isBreakingNews ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-lg">
                          <Sparkles className="w-3.5 h-3.5 fill-red-600/10" /> Breaking
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-slate-50 text-slate-500 text-xs rounded-lg font-medium">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(item.publishDate)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/news/edit/${item._id}`}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit News"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete News"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => fetchNews(page - 1)}
                className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={page === pagination.pages}
                onClick={() => fetchNews(page + 1)}
                className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
