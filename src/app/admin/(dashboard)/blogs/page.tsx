"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getBlogsAPI, deleteBlogAPI } from "@/services/api";
import { formatDate } from "@/lib/utils";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({});

  const fetchBlogs = async (p = 1) => {
    setLoading(true);
    try { let params = `page=${p}&limit=10&admin=true`; if (search) params += `&search=${search}`; const { data } = await getBlogsAPI(params); setBlogs(data.data); setPagination(data.pagination); setPage(p); } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    const loadId = toast.loading("Deleting blog...");
    try { 
      await deleteBlogAPI(id); 
      toast.success("Blog deleted successfully", { id: loadId });
      // Optimistic update
      setBlogs(prev => prev.filter(blog => blog._id !== id));
    } catch (err: any) { 
      toast.error(err.response?.data?.message || "Failed to delete blog", { id: loadId }); 
      fetchBlogs(page); // Refresh if failed to sync
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Manage Blogs</h1>
        <Link href="/admin/blogs/new" className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"><Plus className="w-4 h-4" /> Add Blog</Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search blogs..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetchBlogs()} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" /></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-gray-50 text-left"><th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Title</th><th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th><th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Author</th><th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th><th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? [...Array(5)].map((_, i) => <tr key={i}><td colSpan={5} className="px-6 py-4"><div className="h-4 skeleton-shimmer rounded w-full" /></td></tr>) :
                blogs.length === 0 ? <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No blogs found</td></tr> :
                blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4"><div className="font-medium text-navy text-sm max-w-xs truncate">{blog.title}</div><div className="text-xs text-gray-400">/{blog.slug}</div></td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-primary/5 text-primary text-xs rounded-full font-medium">{blog.category}</span></td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full font-medium ${blog.status === 'draft' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}`}>{blog.status}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-500">{blog.author}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(blog.publishDate || blog.publishedDate)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/blogs/edit/${blog._id}`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></Link>
                        <button onClick={() => handleDelete(blog._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">Page {pagination.page} of {pagination.pages} ({pagination.total} total)</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => fetchBlogs(page - 1)} className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50">Previous</button>
              <button disabled={page === pagination.pages} onClick={() => fetchBlogs(page + 1)} className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
