"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getJobsAPI, deleteJobAPI } from "@/services/api";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({});

  const fetchJobs = async (p = 1) => {
    setLoading(true);
    try { let params = `page=${p}&limit=10`; if (search) params += `&search=${search}`; const { data } = await getJobsAPI(params); setJobs(data.data); setPagination(data.pagination); setPage(p); } catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job?")) return;
    const loadId = toast.loading("Deleting job...");
    try { 
      await deleteJobAPI(id); 
      toast.success("Job deleted successfully", { id: loadId });
      // Optimistic update
      setJobs(prev => prev.filter(job => job._id !== id));
    } catch (err: any) { 
      toast.error(err.response?.data?.message || "Failed to delete job", { id: loadId });
      fetchJobs(page); // Refresh if failed
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Manage Jobs</h1>
        <Link href="/admin/jobs/new" className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-blue-700 text-sm font-medium"><Plus className="w-4 h-4" /> Add Job</Link>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100"><div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetchJobs()} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" /></div></div>
        <div className="overflow-x-auto">
          <table className="w-full"><thead><tr className="bg-gray-50 text-left"><th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Title</th><th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Company</th><th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Location</th><th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Salary</th><th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th><th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? [...Array(5)].map((_, i) => <tr key={i}><td colSpan={6} className="px-6 py-4"><div className="h-4 skeleton-shimmer rounded w-full" /></td></tr>) :
                jobs.length === 0 ? <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No jobs found</td></tr> :
                jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-navy">{job.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{job.company}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{job.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{job.salary}</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full font-medium">{job.type}</span></td>
                    <td className="px-6 py-4"><div className="flex items-center gap-2">
                      <Link href={`/admin/jobs/edit/${job._id}`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></Link>
                      <button onClick={() => handleDelete(job._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div></td>
                  </tr>))}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">Page {page} of {pagination.pages}</span>
            <div className="flex gap-2"><button disabled={page === 1} onClick={() => fetchJobs(page - 1)} className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50">Previous</button><button disabled={page === pagination.pages} onClick={() => fetchJobs(page + 1)} className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50">Next</button></div>
          </div>
        )}
      </div>
    </div>
  );
}
