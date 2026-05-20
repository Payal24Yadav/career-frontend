"use client";
import { useState, useEffect } from "react";
import { getInquiriesAPI, deleteInquiryAPI } from "@/services/api";
import { formatDate } from "@/lib/utils";
import { Trash2, Mail, Phone, Eye } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({});
  const [selected, setSelected] = useState<any>(null);

  const fetchInquiries = async (p = 1) => {
    setLoading(true);
    try { const { data } = await getInquiriesAPI(`page=${p}&limit=10`); setInquiries(data.data); setPagination(data.pagination); setPage(p); } catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetchInquiries(); }, []);

  const handleDelete = async (id: string) => { 
    if (!confirm("Delete this inquiry?")) return; 
    const loadId = toast.loading("Deleting inquiry...");
    try { 
      await deleteInquiryAPI(id); 
      toast.success("Inquiry deleted", { id: loadId });
      // Optimistic update
      setInquiries(prev => prev.filter(inq => inq._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (err: any) { 
      toast.error(err.response?.data?.message || "Failed to delete", { id: loadId });
      fetchInquiries(page);
    } 
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Manage Inquiries</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full"><thead><tr className="bg-gray-50 text-left"><th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th><th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Course</th><th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th><th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? [...Array(5)].map((_, i) => <tr key={i}><td colSpan={4} className="px-6 py-4"><div className="h-4 skeleton-shimmer rounded w-full" /></td></tr>) :
                  inquiries.length === 0 ? <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">No inquiries yet</td></tr> :
                  inquiries.map((inq) => (
                    <tr key={inq._id} className={`hover:bg-gray-50 cursor-pointer ${selected?._id === inq._id ? "bg-blue-50" : ""}`} onClick={() => setSelected(inq)}>
                      <td className="px-6 py-4"><div className="font-medium text-sm text-navy">{inq.name}</div><div className="text-xs text-gray-400">{inq.email}</div></td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-primary/5 text-primary text-xs rounded-full font-medium">{inq.course}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(inq.createdAt)}</td>
                      <td className="px-6 py-4"><div className="flex items-center gap-2"><button onClick={() => setSelected(inq)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button><button onClick={(e) => { e.stopPropagation(); handleDelete(inq._id); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div></td>
                    </tr>))}
              </tbody></table></div>
          {pagination.pages > 1 && <div className="p-4 border-t border-gray-100 flex items-center justify-between"><span className="text-sm text-gray-500">Page {page} of {pagination.pages}</span><div className="flex gap-2"><button disabled={page === 1} onClick={() => fetchInquiries(page - 1)} className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50">Previous</button><button disabled={page === pagination.pages} onClick={() => fetchInquiries(page + 1)} className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50">Next</button></div></div>}
        </div>

        {/* Detail Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          {selected ? (
            <div>
              <h3 className="font-bold text-navy text-lg mb-4">Inquiry Details</h3>
              <div className="space-y-4">
                <div><label className="text-xs text-gray-500 uppercase">Name</label><p className="font-medium text-navy">{selected.name}</p></div>
                <div><label className="text-xs text-gray-500 uppercase">Email</label><p className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /><a href={`mailto:${selected.email}`} className="text-primary hover:underline">{selected.email}</a></p></div>
                <div><label className="text-xs text-gray-500 uppercase">Phone</label><p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><a href={`tel:${selected.phone}`} className="text-primary hover:underline">{selected.phone}</a></p></div>
                <div><label className="text-xs text-gray-500 uppercase">Course</label><p className="font-medium">{selected.course}</p></div>
                <div><label className="text-xs text-gray-500 uppercase">Message</label><p className="text-gray-600 text-sm leading-relaxed">{selected.message || "No message"}</p></div>
                <div><label className="text-xs text-gray-500 uppercase">Date</label><p className="text-sm text-gray-500">{formatDate(selected.createdAt)}</p></div>
                <button onClick={() => handleDelete(selected._id)} className="w-full mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"><Trash2 className="w-4 h-4" /> Delete Inquiry</button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400"><Eye className="w-8 h-8 mx-auto mb-2" /><p className="text-sm">Select an inquiry to view details</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
