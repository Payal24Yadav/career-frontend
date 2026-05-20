"use client";
import { useState, useEffect } from "react";
import { getProgramsAPI, deleteProgramAPI } from "@/services/api";
import { Plus, Search, Edit2, Trash2, GraduationCap, Clock, IndianRupee } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const { data } = await getProgramsAPI(search ? `search=${search}` : "");
      setPrograms(data.data);
    } catch { toast.error("Failed to load programs"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchPrograms(), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this program?")) return;
    const toastId = toast.loading("Deleting program...");
    try {
      await deleteProgramAPI(id);
      toast.success("Program deleted", { id: toastId });
      // Optimistic update
      setPrograms(prev => prev.filter(p => p._id !== id));
    } catch (err: any) { 
      toast.error(err.response?.data?.message || "Failed to delete", { id: toastId });
      fetchPrograms();
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-navy">Manage Online Programs</h1>
        <Link href="/admin/programs/new" className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-sm">
          <Plus className="w-4 h-4" /> Add New Program
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by title or university..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary transition-all text-sm outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Program Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type & Grade</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fees & Duration</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? [...Array(3)].map((_, i) => <tr key={i}><td colSpan={4} className="px-6 py-8"><div className="h-10 skeleton-shimmer rounded-xl" /></td></tr>) :
                programs.length === 0 ? <tr><td colSpan={4} className="px-6 py-20 text-center text-gray-500 font-medium">No programs found</td></tr> :
                programs.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-6">
                      <div className="font-bold text-navy mb-1">{p.title}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1"><GraduationCap className="w-3 h-3" /> {p.universityName}</div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1.5">
                        <span className="w-fit px-2 py-0.5 bg-primary/5 text-primary text-[10px] font-bold rounded uppercase">{p.degreeType}</span>
                        <span className="w-fit px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded uppercase">{p.grade} Grade</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="text-sm font-bold text-navy flex items-center gap-1 mb-1"><IndianRupee className="w-3.5 h-3.5" /> {p.fees}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {p.duration}</div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/programs/edit/${p._id}`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></Link>
                        <button onClick={() => handleDelete(p._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
