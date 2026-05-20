"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getCollegesAPI, deleteCollegeAPI } from "@/services/api";
import { Plus, Edit, Trash2, Search, Star } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCollegesPage() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({});

  const fetchColleges = async (p = 1) => {
    setLoading(true);
    try { let params = `page=${p}&limit=10`; if (search) params += `&search=${search}`; const { data } = await getCollegesAPI(params); setColleges(data.data); setPagination(data.pagination); setPage(p); } catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetchColleges(); }, []);

  const handleDelete = async (id: string) => { 
    if (!confirm("Delete this college?")) return; 
    const loadId = toast.loading("Deleting college...");
    try { 
      await deleteCollegeAPI(id); 
      toast.success("College deleted successfully", { id: loadId });
      // Optimistic update
      setColleges(prev => prev.filter(c => c._id !== id));
    } catch (err: any) { 
      toast.error(err.response?.data?.message || "Failed to delete college", { id: loadId });
      fetchColleges(page);
    } 
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-navy">Manage Colleges</h1><Link href="/admin/colleges/new" className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-blue-700 text-sm font-medium"><Plus className="w-4 h-4" /> Add College</Link></div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100"><div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetchColleges()} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" /></div></div>
        <div className="overflow-x-auto">
          <table className="w-full"><thead><tr className="bg-gray-50 text-left"><th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th><th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Location</th><th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Rating</th><th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Fees</th><th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th><th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? [...Array(5)].map((_, i) => <tr key={i}><td colSpan={6} className="px-6 py-4"><div className="h-4 skeleton-shimmer rounded w-full" /></td></tr>) :
                colleges.length === 0 ? <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No colleges found</td></tr> :
                colleges.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-navy">{c.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{c.city}, {c.state}</td>
                    <td className="px-6 py-4"><div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /><span className="text-sm">{c.rating}</span></div></td>
                    <td className="px-6 py-4 text-sm text-gray-500">{c.fees}</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full font-medium">{c.ownershipType}</span></td>
                    <td className="px-6 py-4"><div className="flex items-center gap-2"><Link href={`/admin/colleges/edit/${c._id}`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></Link><button onClick={() => handleDelete(c._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div></td>
                  </tr>))}
            </tbody></table></div>
        {pagination.pages > 1 && <div className="p-4 border-t border-gray-100 flex items-center justify-between"><span className="text-sm text-gray-500">Page {page} of {pagination.pages}</span><div className="flex gap-2"><button disabled={page === 1} onClick={() => fetchColleges(page - 1)} className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50">Previous</button><button disabled={page === pagination.pages} onClick={() => fetchColleges(page + 1)} className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50">Next</button></div></div>}
      </div>
    </div>
  );
}
